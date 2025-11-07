import { createLogger } from '@cenie/logger'
import React from 'react'

import { classifyError } from '../utils/error-classifier'

/**
 * Default logger for React errors
 */
const defaultLogger = createLogger({ name: 'react-error-boundary' })

/**
 * Error boundary props
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '2rem auto',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
      }}
    >
      <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Something went wrong</h2>
      <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
        An error occurred while rendering this component.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <pre
          style={{
            background: '#f3f4f6',
            padding: '1rem',
            borderRadius: '0.25rem',
            overflow: 'auto',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          {error.message}
        </pre>
      )}
      <button
        onClick={resetError}
        style={{
          background: '#3b82f6',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}

/**
 * React Error Boundary component
 * Catches errors in React component tree
 *
 * @example
 * ```typescript
 * import { ErrorBoundary } from '@cenie/errors/react'
 *
 * function App() {
 *   return (
 *     <ErrorBoundary>
 *       <MyComponent />
 *     </ErrorBoundary>
 *   )
 * }
 * ```
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Classify and log error
    const appError = classifyError(error)
    appError.log(defaultLogger)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

/**
 * Hook to capture errors in functional components
 *
 * @example
 * ```typescript
 * import { useErrorHandler } from '@cenie/errors/react'
 *
 * function MyComponent() {
 *   const handleError = useErrorHandler()
 *
 *   async function fetchData() {
 *     try {
 *       await api.getData()
 *     } catch (error) {
 *       handleError(error)
 *     }
 *   }
 * }
 * ```
 */
export function useErrorHandler(): (error: unknown) => void {
  const [, setError] = React.useState<Error | null>(null)

  return React.useCallback((error: unknown) => {
    const appError = classifyError(error)
    appError.log(defaultLogger)

    // Trigger error boundary
    setError(() => {
      throw error
    })
  }, [])
}
