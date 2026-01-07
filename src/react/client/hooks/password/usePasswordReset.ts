// src/react/client/hooks/password/usePasswordReset.ts

/**
 * Hook for password reset flow
 * Handles requesting password reset and resetting password with token
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useAuthError } from '../utils/useAuthError'

/**
 * Options for usePasswordReset hook
 */
export interface UsePasswordResetOptions {
  /** Callback when reset email is sent */
  onRequestSuccess?: () => void

  /** Callback when password is reset successfully */
  onResetSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void
}

/**
 * Hook for password reset flow
 * Provides two-step flow: request reset → reset password with token
 *
 * @example
 * ```tsx
 * function ResetPasswordForm() {
 *   const { requestReset, resetPassword, isLoading, resetRequested } =
 *     usePasswordReset()
 *
 *   // Step 1: Request reset
 *   const handleRequest = async (email: string) => {
 *     await requestReset(email)
 *   }
 *
 *   // Step 2: Reset with token (from email link)
 *   const handleReset = async (token: string, newPassword: string) => {
 *     await resetPassword(token, newPassword)
 *   }
 * }
 * ```
 */
export function usePasswordReset(options: UsePasswordResetOptions = {}) {
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [resetRequested, setResetRequested] = useState(false)

  /**
   * Request password reset email
   */
  const requestReset = useCallback(
    async (email: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const redirectUrl =
          config.navigation?.passwordResetUrl ||
          `${window.location.origin}/reset-password`

        await authClient.requestPasswordReset({
          email,
          redirectTo: redirectUrl,
        })

        setResetRequested(true)

        const successMessage =
          config.ui?.successMessages?.['password-reset-requested'] ||
          'Check your email for the reset password link!'

        toast.success(successMessage)
        options.onRequestSuccess?.()
        config.onSuccess?.('password-reset-requested', { email })
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Failed to send reset password link')
        setError(error)
        handleError(error, 'request password reset')
        options.onError?.(error)
      } finally {
        setIsLoading(false)
      }
    },
    [config, options, handleError]
  )

  /**
   * Reset password with token
   */
  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await authClient.resetPassword({
          newPassword,
          token,
        })

        const successMessage =
          config.ui?.successMessages?.['password-reset'] ||
          'Password reset successfully!'

        toast.success(successMessage)
        options.onResetSuccess?.()
        config.onSuccess?.('password-reset')
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to reset password')
        setError(error)
        handleError(error, 'reset password')
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
    setResetRequested(false)
  }, [])

  return {
    /** Request password reset email */
    requestReset,

    /** Reset password with token */
    resetPassword,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Whether reset email was requested */
    resetRequested,

    /** Reset hook state */
    reset,
  }
}
