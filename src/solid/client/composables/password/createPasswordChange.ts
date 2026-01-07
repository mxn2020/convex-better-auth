// src/solid/client/composables/createPasswordChange.ts

/**
 * Composable for changing user password
 * Requires current password for security
 */

import { createSignal } from 'solid-js'
import { toast } from 'solid-sonner'
import { authClient } from '../../auth-client'
import { createAuthConfig } from '../../providers/AuthConfigProvider'
import { createAuthError } from '../utils'

/**
 * Options for createPasswordChange composable
 */
export interface CreatePasswordChangeOptions {
  /** Callback on successful password change */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void
}

/**
 * Composable for changing user password
 * Requires current password and allows revoking other sessions
 *
 * @example
 * ```tsx
 * function ChangePasswordForm() {
 *   const { changePassword, isLoading, success } = createPasswordChange({
 *     onSuccess: () => console.log('Password changed!'),
 *   })
 *
 *   const handleSubmit = async (
 *     currentPassword: string,
 *     newPassword: string,
 *     revokeOtherSessions: boolean
 *   ) => {
 *     await changePassword(currentPassword, newPassword, revokeOtherSessions)
 *   }
 * }
 * ```
 */
export function createPasswordChange(options: CreatePasswordChangeOptions = {}) {
  const { config } = createAuthConfig()
  const { handleError } = createAuthError()

  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)
  const [success, setSuccess] = createSignal(false)

  /**
   * Change user password
   * @param currentPassword - Current password for verification
   * @param newPassword - New password to set
   * @param revokeOtherSessions - Whether to revoke all other sessions
   */
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    revokeOtherSessions = false
  ) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      })

      setSuccess(true)

      const successMessage =
        config().ui?.successMessages?.['password-changed'] ||
        'Password changed successfully!'

      toast.success(successMessage)
      options.onSuccess?.()
      config().onSuccess?.('password-changed')
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to change password')
      setError(error)
      handleError(error, 'change password')
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
    setSuccess(false)
  }

  return {
    /** Change user password */
    changePassword,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Whether password was changed successfully */
    success,

    /** Reset composable state */
    reset,
  }
}
