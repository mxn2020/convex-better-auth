/**
 * Hook for email/password sign-in in Solid
 * Handles authentication with 2FA redirect logic and auto-navigation
 */

import { createSignal } from 'solid-js'
import { useNavigate, useRouter } from '@tanstack/solid-router'
import { toast } from 'solid-sonner'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useAuthError } from '../utils/useAuthError'

/**
 * Options for useSignIn hook
 */
export interface UseSignInOptions {
  /** Callback on successful sign-in */
  onSuccess?: (data: any) => void

  /** Callback on error */
  onError?: (error: Error) => void

  /** Custom redirect path (overrides config) */
  redirectTo?: string

  /** Disable auto-navigation after sign-in */
  disableAutoNavigate?: boolean
}

/**
 * Hook for email/password authentication
 * Provides sign-in functionality with loading states and error handling
 *
 * @example
 * ```tsx
 * function SignInForm() {
 *   const { signInWithPassword, isLoading, error } = useSignIn({
 *     onSuccess: () => console.log('Signed in!'),
 *   })
 *
 *   const handleSubmit = async (email: string, password: string) => {
 *     await signInWithPassword(email, password)
 *   }
 * }
 * ```
 */
export function useSignIn(options: UseSignInOptions = {}) {
  const navigate = useNavigate()
  const router = useRouter()
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)
  const [data, setData] = createSignal<any>(null)

  /**
   * Sign in with email and password
   */
  const signInWithPassword = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    setData(null)

    console.log('Starting sign-in process...')

    try {
      const result = await authClient.signIn.email(
        { email, password },
        {
          onSuccess: async (ctx) => {
            setData(ctx.data)

            // Handle 2FA redirect
            if (ctx.data.twoFactorRedirect) {
              const twoFactorUrl = config.navigation?.twoFactorUrl || '/verify-2fa'
              if (!options.disableAutoNavigate) {
                await navigate({ to: twoFactorUrl })
              }
            } else {
              // Normal sign-in success
              const successMessage =
                config.ui?.successMessages?.['sign-in'] ||
                'Successfully signed in!'

              toast.success(successMessage)

              // Navigate using router (same as old working code)
              if (!options.disableAutoNavigate) {
                const redirectPath =
                  options.redirectTo ||
                  config.navigation?.afterSignIn ||
                  '/'

                router.navigate({ to: redirectPath })
              }
            }

            // Call custom success handler
            options.onSuccess?.(ctx.data)
            config.onSuccess?.('sign-in', ctx.data)
          },
          onError: (ctx) => {
            const err = new Error(ctx.error.message)
            setError(err)
            handleError(err, 'sign in')
            options.onError?.(err)
          },
        }
      )

      // Handle error from result
      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign in failed')
      setError(error)
      handleError(error, 'sign in')
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Reset hook state
   */
  const reset = () => {
    setError(null)
    setData(null)
  }

  return {
    /** Sign in with email and password */
    signInWithPassword,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Response data (if successful) */
    data,

    /** Reset hook state */
    reset,
  }
}
