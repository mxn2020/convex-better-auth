/**
 * Hook for changing user password
 * Requires current password for security
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useAuthError } from '../utils/useAuthError'

/**
 * Options for usePasswordChange hook
 */
export interface UsePasswordChangeOptions {
  /** Callback on successful password change */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void
}

/**
 * Hook for changing user password
 * Requires current password and allows revoking other sessions
 *
 * @example
 * ```tsx
 * function ChangePasswordForm() {
 *   const { changePassword, isLoading, success } = usePasswordChange({
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
export function usePasswordChange(options: UsePasswordChangeOptions = {}) {
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [success, setSuccess] = useState(false)

  /**
   * Change user password
   * @param currentPassword - Current password for verification
   * @param newPassword - New password to set
   * @param revokeOtherSessions - Whether to revoke all other sessions
   */
  const changePassword = useCallback(
    async (
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
          config.ui?.successMessages?.['password-changed'] ||
          'Password changed successfully!'

        toast.success(successMessage)
        options.onSuccess?.()
        config.onSuccess?.('password-changed')
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to change password')
        setError(error)
        handleError(error, 'change password')
        options.onError?.(error)
      } finally {
        setIsLoading(false)
      }
    },
    [config, options, handleError]
  )

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setError(null)
    setSuccess(false)
  }, [])

  return {
    /** Change user password */
    changePassword,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Whether password was changed successfully */
    success,

    /** Reset hook state */
    reset,
  }
}
