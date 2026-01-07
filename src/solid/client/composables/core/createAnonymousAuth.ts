/**
 * Composable for anonymous authentication in Solid
 * Allows users to sign in without providing credentials
 */

import { createSignal } from 'solid-js'
import { useNavigate } from '@tanstack/solid-router'
import { toast } from 'solid-sonner'
import { authClient } from '../../auth-client'
import { createAuthConfig } from '../utils/createAuthConfig'
import { createAuthError } from '../utils/createAuthError'

/**
 * Options for createAnonymousAuth composable
 */
export interface CreateAnonymousAuthOptions {
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
 * Composable for anonymous authentication
 * Allows users to access the app without creating an account
 *
 * @example
 * ```tsx
 * function AnonymousSignIn() {
 *   const { signInAnonymously, isLoading } = createAnonymousAuth()
 *
 *   return (
 *     <button onClick={signInAnonymously} disabled={isLoading()}>
 *       Continue as Guest
 *     </button>
 *   )
 * }
 * ```
 */
export function createAnonymousAuth(options: CreateAnonymousAuthOptions = {}) {
  const navigate = useNavigate()
  const { config } = createAuthConfig()
  const { handleError } = createAuthError()

  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)

  /**
   * Sign in anonymously
   */
  const signInAnonymously = async () => {
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
              config().ui?.successMessages?.['anonymous-sign-in'] ||
              'Signed in anonymously!'

            toast.success(successMessage)

            // Reload page for Convex to pick up auth state
            // Router will handle redirect based on new auth state
            if (!options.disableAutoNavigate) {
              window.location.reload()
            }

            options.onSuccess?.()
            config().onSuccess?.('anonymous-sign-in')
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
  }

  /**
   * Reset composable state
   */
  const reset = () => {
    setError(null)
  }

  return {
    /** Sign in anonymously */
    signInAnonymously,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Reset composable state */
    reset,
  }
}
