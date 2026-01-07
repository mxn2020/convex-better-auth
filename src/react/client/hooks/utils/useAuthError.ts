// src/react/client/hooks/utils/useAuthError.ts

/**
 * Centralized error handling hook for auth operations
 * Provides consistent error display using toast notifications
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useAuthConfig } from '../../providers/AuthConfigProvider'
import { formatError, toError } from '../../utils/errors'

/**
 * Hook for handling authentication errors
 * Provides centralized error handling with toast notifications and logging
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { handleError, error, clearError } = useAuthError()
 *
 *   try {
 *     await someAuthOperation()
 *   } catch (err) {
 *     handleError(err, 'Sign In')
 *   }
 * }
 * ```
 */
export function useAuthError() {
  const { config } = useAuthConfig()
  const [error, setError] = useState<Error | null>(null)

  /**
   * Handle an error by:
   * 1. Storing it in state
   * 2. Showing a toast notification
   * 3. Logging in development
   * 4. Calling custom error handler if configured
   */
  const handleError = useCallback(
    (err: unknown, context?: string) => {
      const errorObj = toError(err)
      setError(errorObj)

      // Get custom error message if configured
      const customMessage = config.ui?.errorMessages?.[errorObj.message]
      const message = customMessage || formatError(errorObj)

      // Show toast notification
      toast.error(message, {
        description: context ? `Failed to ${context}` : undefined,
      })

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`[Auth Error${context ? ` - ${context}` : ''}]:`, errorObj)
      }

      // Call custom error handler if provided
      config.onError?.(errorObj, context || 'Unknown')
    },
    [config]
  )

  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    /** Current error (if any) */
    error,

    /** Handle an error with toast notification and logging */
    handleError,

    /** Clear the current error */
    clearError,
  }
}
