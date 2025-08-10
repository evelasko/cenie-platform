import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import type { Database } from './types/database'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user has access to the current app
  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const appDomain = request.nextUrl.hostname.split('.')[0]
    const hasAccess = await checkUserAppAccess(supabase, user.id, appDomain)
    
    if (!hasAccess) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/unauthorized'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}

async function checkUserAppAccess(
  supabase: any,
  userId: string,
  appDomain: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_app_access')
    .select('*')
    .eq('user_id', userId)
    .eq('app_name', appDomain)
    .eq('is_active', true)
    .single()

  return !error && data
}