import { AnalyticsProvider } from '@cenie/firebase/analytics'
import { AuthProvider } from '@cenie/firebase/auth'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AnalyticsProvider enableDebug={process.env.NODE_ENV === 'development'}>
        {children}
      </AnalyticsProvider>
    </AuthProvider>
  )
}
