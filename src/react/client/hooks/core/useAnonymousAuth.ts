/**
 * Hook for anonymous authentication
 * Allows users to sign in without providing credentials
 */

import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'solid-sonner'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useAuthError } from '../utils/useAuthError'

/**
 * Options for useAnonymousAuth hook
 */
export interface UseAnonymousAuthOptions {
  /** Callback on successful sign-in */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void

  /** Custom redirect path (overrides config) */
  redirectTo?: string

  /** Disable auto-navigation after sign-in */
  disableAutoNavigate?: boolean
}

/**
 * Hook for anonymous authentication
 * Allows users to access the app without creating an account
 *
 * @example
 * ```tsx
 * function AnonymousSignIn() {
 *   const { signInAnonymously, isLoading } = useAnonymousAuth()
 *
 *   return (
 *     <button onClick={signInAnonymously} disabled={isLoading}>
 *       Continue as Guest
 *     </button>
 *   )
 * }
 * ```
 */
export function useAnonymousAuth(options: UseAnonymousAuthOptions = {}) {
  const navigate = useNavigate()
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Sign in anonymously
   */
  const signInAnonymously = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await authClient.signIn.anonymous(
        {},
        {
          onRequest: () => {
            setIsLoading(true)
          },
          onSuccess: async () => {
            const successMessage =
              config.ui?.successMessages?.['anonymous-sign-in'] ||
              'Signed in anonymously!'

            toast.success(successMessage)

            // Reload page for Convex to pick up auth state
            // Router will handle redirect based on new auth state
            if (!options.disableAutoNavigate) {
              window.location.reload()
            }

            options.onSuccess?.()
            config.onSuccess?.('anonymous-sign-in')
          },
          onError: (ctx) => {
            const err = new Error(ctx.error.message)
            setError(err)
            handleError(err, 'sign in anonymously')
            options.onError?.(err)
          },
        }
      )
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Anonymous sign-in failed')
      setError(error)
      handleError(error, 'sign in anonymously')
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [navigate, config, options, handleError])

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setError(null)
  }, [])

  return {
    /** Sign in anonymously */
    signInAnonymously,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Reset hook state */
    reset,
  }
}
