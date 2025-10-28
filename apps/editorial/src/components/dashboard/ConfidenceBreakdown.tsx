import type { ConfidenceBreakdown } from '@/types/books'

interface ConfidenceBreakdownProps {
  breakdown: ConfidenceBreakdown
  notes?: string
}

const factorLabels: Record<keyof Omit<ConfidenceBreakdown, 'total'>, string> = {
  authorMatch: 'Author Match',
  titleSimilarity: 'Title Similarity',
  publisherKnown: 'Known Publisher',
  isbnLinked: 'ISBN Linked',
  categoryMatch: 'Category Match',
  dateReasonable: 'Publication Date',
}

const factorMaxScores: Record<keyof Omit<ConfidenceBreakdown, 'total'>, number> = {
  authorMatch: 40,
  titleSimilarity: 40,
  publisherKnown: 10,
  isbnLinked: 10,
  categoryMatch: 5,
  dateReasonable: 5,
}

export function ConfidenceBreakdownComponent({ breakdown, notes }: ConfidenceBreakdownProps) {
  const getConfidenceColor = (score: number): string => {
    if (score >= 80) return 'text-green-700 bg-green-50 border-green-200'
    if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-200'
    if (score >= 40) return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    return 'text-gray-700 bg-gray-50 border-gray-200'
  }

  const getBarColor = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 75) return 'bg-green-500'
    if (percentage >= 50) return 'bg-blue-500'
    if (percentage >= 25) return 'bg-yellow-500'
    return 'bg-gray-300'
  }

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className={`p-4 rounded-lg border ${getConfidenceColor(breakdown.total)}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Confidence Score</h3>
          <span className="text-2xl font-bold">{breakdown.total}%</span>
        </div>
        <div className="mt-2 text-sm">
          {breakdown.total >= 80 && '✓ High confidence - Likely correct match'}
          {breakdown.total >= 70 && breakdown.total < 80 && '~ Good confidence - Recommend review'}
          {breakdown.total >= 40 && breakdown.total < 70 && '! Medium confidence - Manual verification needed'}
          {breakdown.total < 40 && '✗ Low confidence - Probably not a match'}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Score Breakdown</h4>
        <div className="space-y-3">
          {(Object.keys(factorLabels) as Array<keyof typeof factorLabels>).map((factor) => {
            const score = breakdown[factor]
            const maxScore = factorMaxScores[factor]
            const percentage = (score / maxScore) * 100

            return (
              <div key={factor}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">{factorLabels[factor]}</span>
                  <span className="font-medium text-gray-900">
                    {score} / {maxScore} pts
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getBarColor(score, maxScore)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Investigation Notes */}
      {notes && (
        <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <summary className="font-semibold text-gray-900 cursor-pointer">
            Investigation Details
          </summary>
          <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap font-mono">{notes}</pre>
        </details>
      )}
    </div>
  )
}
