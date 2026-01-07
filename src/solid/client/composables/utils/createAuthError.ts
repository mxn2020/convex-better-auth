// src/solid/client/composables/utils/createAuthError.ts

/**
 * Centralized error handling composable for auth operations
 * Provides consistent error display using toast notifications
 */

import { createSignal } from 'solid-js'
import { toast } from 'solid-sonner'
import { createAuthConfig } from '../../providers/AuthConfigProvider'
import { formatError, toError } from '../../utils/errors'

/**
 * Composable for handling authentication errors
 * Provides centralized error handling with toast notifications and logging
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { handleError, error, clearError } = createAuthError()
 *
 *   try {
 *     await someAuthOperation()
 *   } catch (err) {
 *     handleError(err, 'Sign In')
 *   }
 * }
 * ```
 */
export function createAuthError() {
  const { config } = createAuthConfig()
  const [error, setError] = createSignal<Error | null>(null)

  /**
   * Handle an error by:
   * 1. Storing it in state
   * 2. Showing a toast notification
   * 3. Logging in development
   * 4. Calling custom error handler if configured
   */
  const handleError = (err: unknown, context?: string) => {
    const errorObj = toError(err)
    setError(errorObj)

    // Get custom error message if configured
    const customMessage = config().ui?.errorMessages?.[errorObj.message]
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
    config().onError?.(errorObj, context || 'Unknown')
  }

  /**
   * Clear the current error
   */
  const clearError = () => {
    setError(null)
  }

  return {
    /** Current error (if any) */
    error,

    /** Handle an error with toast notification and logging */
    handleError,

    /** Clear the current error */
    clearError,
  }
}