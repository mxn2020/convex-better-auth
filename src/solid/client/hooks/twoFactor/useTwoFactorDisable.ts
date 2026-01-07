/**
 * Hook for disabling two-factor authentication in Solid
 * Requires password verification for security
 */

import { createSignal } from 'solid-js'
import { toast } from 'solid-sonner'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useAuthError } from '../utils/useAuthError'

/**
 * Options for useTwoFactorDisable hook
 */
export interface UseTwoFactorDisableOptions {
  /** Callback on successful 2FA disable */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void
}

/**
 * Hook for disabling two-factor authentication
 * Requires password verification to disable
 *
 * @example
 * ```tsx
 * function DisableTwoFactorButton() {
 *   const { disableTwoFactor, isLoading } = useTwoFactorDisable({
 *     onSuccess: () => console.log('2FA disabled'),
 *   })
 *
 *   const handleClick = async () => {
 *     const password = prompt('Enter your password to disable 2FA')
 *     if (password) {
 *       await disableTwoFactor(password)
 *     }
 *   }
 *
 *   return (
 *     <button onClick={handleClick} disabled={isLoading()}>
 *       Disable 2FA
 *     </button>
 *   )
 * }
 * ```
 */
export function useTwoFactorDisable(
  options: UseTwoFactorDisableOptions = {}
) {
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)
  const [success, setSuccess] = createSignal(false)

  /**
   * Disable 2FA with password verification
   */
  const disableTwoFactor = async (password: string) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await authClient.twoFactor.disable({
        password,
      })

      setSuccess(true)

      const successMessage =
        config.ui?.successMessages?.['2fa-disabled'] ||
        'Two-factor authentication disabled'

      toast.success(successMessage)
      options.onSuccess?.()
      config.onSuccess?.('2fa-disabled')
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to disable 2FA')
      setError(error)
      handleError(error, 'disable two-factor authentication')
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
    setSuccess(false)
  }

  return {
    /** Disable 2FA with password verification */
    disableTwoFactor,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Whether 2FA was disabled successfully */
    success,

    /** Reset hook state */
    reset,
  }
}
