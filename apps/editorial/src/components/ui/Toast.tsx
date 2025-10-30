'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'
import { TYPOGRAPHY } from '@/lib/typography'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastProps {
  id: string
  message: string
  type?: ToastType
  duration?: number
  onClose: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const toastStyles = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-900 dark:text-green-100',
  },
  error: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    icon: 'text-destructive',
    text: 'text-destructive',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-100',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-900 dark:text-yellow-100',
  },
}

export default function Toast({ id, message, type = 'info', duration = 5000, onClose }: ToastProps) {
  const Icon = toastIcons[type]
  const styles = toastStyles[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, id, onClose])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        'flex items-start gap-3 p-4 rounded-none border shadow-lg',
        'min-w-[320px] max-w-md',
        'animate-fade-in-up',
        styles.bg,
        styles.border
      )}
    >
      {/* Icon */}
      <Icon className={clsx('h-5 w-5 shrink-0 mt-0.5', styles.icon)} />

      {/* Message */}
      <div className="flex-1">
        <p className={clsx(TYPOGRAPHY.bodyBase, styles.text)}>{message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => onClose(id)}
        className={clsx(
          'shrink-0 p-1 rounded-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors',
          styles.text
        )}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

