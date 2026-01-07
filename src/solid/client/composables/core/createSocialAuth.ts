/**
 * Composable for social OAuth authentication (GitHub, Google, etc.) in Solid
 * Handles OAuth redirect flow
 */

import { createSignal } from 'solid-js'
import { toast } from 'solid-sonner'
import { authClient } from '../../auth-client'
import { createAuthConfig } from '../utils/createAuthConfig'
import { createAuthError } from '../utils/createAuthError'

/**
 * Supported OAuth providers
 */
export type SocialProvider = 'github' | 'google'

/**
 * Options for createSocialAuth composable
 */
export interface CreateSocialAuthOptions {
  /** Callback on successful auth */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void
}

/**
 * Composable for social OAuth authentication
 * Handles GitHub, Google, and other OAuth providers
 *
 * @param provider - OAuth provider ('github' | 'google')
 * @param options - Composable options
 *
 * @example
 * ```tsx
 * function SignInForm() {
 *   const githubAuth = createSocialAuth('github')
 *   const googleAuth = createSocialAuth('google')
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
export function createSocialAuth(
  provider: SocialProvider,
  options: CreateSocialAuthOptions = {}
) {
  const { config } = createAuthConfig()
  const { handleError } = createAuthError()

  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)

  /**
   * Initiate social sign-in
   * Redirects to OAuth provider
   */
  const signIn = async () => {
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
              config().ui?.successMessages?.[`${provider}-sign-in`] ||
              `Successfully signed in with ${provider}!`

            toast.success(successMessage)
            options.onSuccess?.()
            config().onSuccess?.(`${provider}-sign-in`)
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
  }

  /**
   * Reset composable state
   */
  const reset = () => {
    setError(null)
  }

  return {
    /** Initiate social sign-in (redirects to OAuth provider) */
    signIn,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Reset composable state */
    reset,
  }
}
