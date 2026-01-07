/**
 * Hook for resending email verification
 * Handles cooldown timer to prevent spam
 */

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'solid-sonner'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useAuthError } from '../utils/useAuthError'

/**
 * Default cooldown in seconds
 */
const DEFAULT_COOLDOWN = 60

/**
 * Storage key for cooldown timer
 */
const STORAGE_KEY = 'auth_verification_cooldown'

/**
 * Options for useResendVerification hook
 */
export interface UseResendVerificationOptions {
  /** Cooldown period in seconds (default: 60) */
  cooldownSeconds?: number

  /** Callback on successful resend */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void

  /** Whether to persist cooldown in localStorage */
  persistCooldown?: boolean
}

/**
 * Hook for resending email verification
 * Includes cooldown timer to prevent abuse
 *
 * @example
 * ```tsx
 * function ResendVerificationButton() {
 *   const { resendVerification, isLoading, canResend, countdown } =
 *     useResendVerification({
 *       cooldownSeconds: 60,
 *     })
 *
 *   return (
 *     <button
 *       onClick={() => resendVerification('user@example.com')}
 *       disabled={!canResend || isLoading}
 *     >
 *       {canResend
 *         ? 'Resend Verification'
 *         : `Wait ${countdown}s`}
 *     </button>
 *   )
 * }
 * ```
 */
export function useResendVerification(
  options: UseResendVerificationOptions = {}
) {
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const cooldownDuration =
    options.cooldownSeconds ?? config.password?.minLength ?? DEFAULT_COOLDOWN

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [countdown, setCountdown] = useState(0)

  // Load countdown from localStorage on mount
  useEffect(() => {
    if (options.persistCooldown) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const expiresAt = parseInt(stored, 10)
        const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
        if (remaining > 0) {
          setCountdown(remaining)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }
  }, [options.persistCooldown])

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)

        // Clear storage when countdown reaches 0
        if (countdown === 1 && options.persistCooldown) {
          localStorage.removeItem(STORAGE_KEY)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [countdown, options.persistCooldown])

  /**
   * Resend verification email
   */
  const resendVerification = useCallback(
    async (email: string) => {
      if (countdown > 0) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        await (authClient as { emailVerification?: { sendVerificationEmail: (params: { email: string }) => Promise<unknown> } }).emailVerification?.sendVerificationEmail({
          email,
        })

        // Start cooldown
        setCountdown(cooldownDuration)

        // Persist cooldown in localStorage if enabled
        if (options.persistCooldown) {
          const expiresAt = Date.now() + cooldownDuration * 1000
          localStorage.setItem(STORAGE_KEY, expiresAt.toString())
        }

        const successMessage =
          config.ui?.successMessages?.['verification-sent'] ||
          'Verification email sent! Check your inbox.'

        toast.success(successMessage)
        options.onSuccess?.()
        config.onSuccess?.('verification-sent', { email })
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Failed to resend verification email')
        setError(error)
        handleError(error, 'resend verification')
        options.onError?.(error)
      } finally {
        setIsLoading(false)
      }
    },
    [countdown, cooldownDuration, config, options, handleError]
  )

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setError(null)
    setCountdown(0)
    if (options.persistCooldown) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [options.persistCooldown])

  return {
    /** Resend verification email */
    resendVerification,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Whether resend is allowed (countdown finished) */
    canResend: countdown === 0,

    /** Seconds remaining before resend allowed */
    countdown,

    /** Reset hook state */
    reset,
  }
}
