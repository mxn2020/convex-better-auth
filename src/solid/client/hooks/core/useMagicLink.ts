/**
 * Hook for magic link authentication in Solid
 * Sends a magic link to the user's email for passwordless sign-in
 */

import { createSignal } from 'solid-js'
import { toast } from 'solid-sonner'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useAuthError } from '../utils/useAuthError'

/**
 * Options for useMagicLink hook
 */
export interface UseMagicLinkOptions {
  /** Callback when magic link is sent */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void
}

/**
 * Hook for magic link authentication
 * Sends a one-time login link to the user's email
 *
 * @example
 * ```tsx
 * function MagicLinkForm() {
 *   const { sendMagicLink, isLoading, emailSent } = useMagicLink()
 *
 *   const handleSubmit = async (email: string) => {
 *     await sendMagicLink(email)
 *   }
 *
 *   return (
 *     <Show when={emailSent()} fallback={<EmailForm />}>
 *       <p>Check your email for the login link!</p>
 *     </Show>
 *   )
 * }
 * ```
 */
export function useMagicLink(options: UseMagicLinkOptions = {}) {
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)
  const [emailSent, setEmailSent] = createSignal(false)
  const [lastEmail, setLastEmail] = createSignal<string>('')

  /**
   * Send magic link to email
   */
  const sendMagicLink = async (email: string) => {
    setIsLoading(true)
    setError(null)
    setEmailSent(false)

    try {
      await authClient.signIn.magicLink(
        { email },
        {
          onRequest: () => {
            setIsLoading(true)
          },
          onSuccess: () => {
            setIsLoading(false)
            setEmailSent(true)
            setLastEmail(email)

            const successMessage =
              config.ui?.successMessages?.['magic-link'] ||
              'Check your email for the magic link!'

            toast.success(successMessage)
            options.onSuccess?.()
            config.onSuccess?.('magic-link-sent', { email })
          },
          onError: (ctx) => {
            const err = new Error(ctx.error.message)
            setIsLoading(false)
            setError(err)
            handleError(err, 'send magic link')
            options.onError?.(err)
          },
        }
      )
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to send magic link')
      setError(error)
      handleError(error, 'send magic link')
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
    setEmailSent(false)
    setLastEmail('')
  }

  return {
    /** Send magic link to email */
    sendMagicLink,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Whether email was sent successfully */
    emailSent,

    /** Last email address used */
    lastEmail,

    /** Reset hook state */
    reset,
  }
}
