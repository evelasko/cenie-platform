import { NextRequest, NextResponse } from 'next/server'
import { createNextServerClient } from '@cenie/supabase/server'
import { requireRole } from '@/lib/auth-helpers'
import { logger } from '@/lib/logger'

/**
 * POST /api/translate
 * Translate text using Google Cloud Translation API with glossary integration
 * Body:
 * - text: text to translate (required)
 * - sourceLanguage: source language code (optional, default: 'en')
 * - targetLanguage: target language code (optional, default: 'es')
 * - useGlossary: whether to use translation glossary (optional, default: true)
 */
export async function POST(request: NextRequest) {
  try {
    // Require editor or admin role
    const authResult = await requireRole('editor')
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { text, sourceLanguage = 'en', targetLanguage = 'es', useGlossary = true } = body

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    logger.debug('Translation request received', { textLength: text.length })

    const apiKey = process.env.GOOGLE_CLOUD_TRANSLATION_API_KEY

    if (!apiKey) {
      logger.error('Google Cloud Translation API key not configured')
      return NextResponse.json({ error: 'Translation service not configured' }, { status: 500 })
    }

    // Load glossary if requested
    let glossaryTerms: { [key: string]: string } = {}
    let glossaryUsed: string[] = []

    if (useGlossary) {
      const supabase = createNextServerClient()
      const { data: glossary } = await supabase
        .from('translation_glossary')
        .select('term_en, term_es')
        .eq('context', 'theater') // Start with theater terms, can expand
        .limit(1000)

      if (glossary && Array.isArray(glossary)) {
        glossaryTerms = glossary.reduce<{ [key: string]: string }>((acc, entry) => {
          if (entry && typeof entry === 'object' && 'term_en' in entry && 'term_es' in entry) {
            acc[(entry as any).term_en.toLowerCase()] = (entry as any).term_es
          }
          return acc
        }, {})
      }
    }

    // Pre-process text with glossary (case-insensitive replacement)
    let processedText = text
    if (useGlossary && Object.keys(glossaryTerms).length > 0) {
      Object.entries(glossaryTerms).forEach(([enTerm, esTerm]) => {
        // Match whole words only, case-insensitive
        const regex = new RegExp(`\\b${enTerm}\\b`, 'gi')
        const matches = processedText.match(regex)
        if (matches) {
          processedText = processedText.replace(regex, esTerm)
          glossaryUsed.push(enTerm)
        }
      })
    }

    // If all text was replaced by glossary, return immediately
    if (processedText === processedText && glossaryUsed.length > 0 && processedText !== text) {
      return NextResponse.json({
        translated_text: processedText,
        glossary_terms_used: glossaryUsed,
        source: 'glossary_only',
      })
    }

    // Call Google Cloud Translation API
    const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`

    const response = await fetch(translateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: processedText,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      logger.error('Google Translate API error', { error })
      return NextResponse.json(
        { error: 'Translation service error', details: error },
        { status: 500 }
      )
    }

    const translateData = await response.json()
    const translatedText = translateData.data.translations[0].translatedText

    return NextResponse.json({
      translated_text: translatedText,
      glossary_terms_used: glossaryUsed,
      source: glossaryUsed.length > 0 ? 'api_with_glossary' : 'api_only',
      detected_source_language: translateData.data.translations[0].detectedSourceLanguage,
    })
  } catch (error) {
    logger.error('Translation error', { error })
    return NextResponse.json(
      {
        error: 'Failed to translate text',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
