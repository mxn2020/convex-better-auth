/**
 * Hook for social OAuth authentication (GitHub, Google, etc.)
 * Handles OAuth redirect flow
 */

import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useAuthError } from '../utils/useAuthError'

/**
 * Supported OAuth providers
 */
export type SocialProvider = 'github' | 'google'

/**
 * Options for useSocialAuth hook
 */
export interface UseSocialAuthOptions {
  /** Callback on successful auth */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void
}

/**
 * Hook for social OAuth authentication
 * Handles GitHub, Google, and other OAuth providers
 *
 * @param provider - OAuth provider ('github' | 'google')
 * @param options - Hook options
 *
 * @example
 * ```tsx
 * function SignInForm() {
 *   const githubAuth = useSocialAuth('github')
 *   const googleAuth = useSocialAuth('google')
 *
 *   return (
 *     <>
 *       <button onClick={githubAuth.signIn}>
 *         Sign in with GitHub
 *       </button>
 *       <button onClick={googleAuth.signIn}>
 *         Sign in with Google
 *       </button>
 *     </>
 *   )
 * }
 * ```
 */
export function useSocialAuth(
  provider: SocialProvider,
  options: UseSocialAuthOptions = {}
) {
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Initiate social sign-in
   * Redirects to OAuth provider
   */
  const signIn = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await authClient.signIn.social(
        { provider },
        {
          onRequest: () => {
            setIsLoading(true)
          },
          onResponse: () => {
            setIsLoading(false)
          },
          onSuccess: () => {
            const successMessage =
              config.ui?.successMessages?.[`${provider}-sign-in`] ||
              `Successfully signed in with ${provider}!`

            toast.success(successMessage)
            options.onSuccess?.()
            config.onSuccess?.(`${provider}-sign-in`)
          },
          onError: (ctx) => {
            const err = new Error(ctx.error.message)
            setError(err)
            handleError(err, `sign in with ${provider}`)
            options.onError?.(err)
          },
        }
      )
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error(`${provider} sign-in failed`)
      setError(error)
      handleError(error, `sign in with ${provider}`)
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [provider, config, options, handleError])

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setError(null)
  }, [])

  return {
    /** Initiate social sign-in (redirects to OAuth provider) */
    signIn,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Reset hook state */
    reset,
  }
}
