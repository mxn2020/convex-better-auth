/**
 * Hook for OTP (One-Time Password) authentication
 * Handles two-step flow: send OTP → verify OTP
 */

import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useAuthError } from '../utils/useAuthError'

/**
 * Resend cooldown in seconds
 */
const RESEND_COOLDOWN = 60

/**
 * Options for useOTPAuth hook
 */
export interface UseOTPAuthOptions {
  /** Type of OTP flow */
  type?: 'sign-in' | 'sign-up'

  /** Callback on successful verification */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void

  /** Custom redirect path (overrides config) */
  redirectTo?: string

  /** Disable auto-navigation after verification */
  disableAutoNavigate?: boolean
}

/**
 * Hook for OTP authentication
 * Provides two-step authentication: send OTP, then verify code
 *
 * @example
 * ```tsx
 * function OTPForm() {
 *   const {
 *     sendOTP,
 *     verifyOTP,
 *     resendOTP,
 *     isLoading,
 *     otpSent,
 *     canResend,
 *     countdown,
 *   } = useOTPAuth()
 *
 *   const [email, setEmail] = useState('')
 *   const [code, setCode] = useState('')
 *
 *   if (!otpSent) {
 *     return (
 *       <button onClick={() => sendOTP(email)}>
 *         Send Code
 *       </button>
 *     )
 *   }
 *
 *   return (
 *     <>
 *       <input value={code} onChange={e => setCode(e.target.value)} />
 *       <button onClick={() => verifyOTP(email, code)}>
 *         Verify
 *       </button>
 *       {canResend && (
 *         <button onClick={resendOTP}>Resend</button>
 *       )}
 *     </>
 *   )
 * }
 * ```
 */
export function useOTPAuth(options: UseOTPAuthOptions = {}) {
  const navigate = useNavigate()
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [lastEmail, setLastEmail] = useState<string>('')

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  /**
   * Send OTP to email
   */
  const sendOTP = useCallback(
    async (email: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await authClient.emailOtp.sendVerificationOtp(
          {
            email,
            type: options.type === 'sign-up' ? 'email-verification' : 'sign-in',
          },
          {
            onRequest: () => {
              setIsLoading(true)
            },
            onSuccess: () => {
              setOtpSent(true)
              setLastEmail(email)
              setCountdown(RESEND_COOLDOWN)

              const successMessage =
                config.ui?.successMessages?.['otp-sent'] ||
                'Verification code sent! Check your email.'

              toast.success(successMessage)
              config.onSuccess?.('otp-sent', { email })
            },
            onError: (ctx) => {
              const err = new Error(ctx.error.message)
              setError(err)
              handleError(err, 'send verification code')
              options.onError?.(err)
            },
          }
        )
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to send OTP')
        setError(error)
        handleError(error, 'send verification code')
        options.onError?.(error)
      } finally {
        setIsLoading(false)
      }
    },
    [config, options, handleError]
  )

  /**
   * Verify OTP code
   */
  const verifyOTP = useCallback(
    async (email: string, code: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await authClient.signIn.emailOtp(
          { email, otp: code },
          {
            onRequest: () => {
              setIsLoading(true)
            },
            onSuccess: async () => {
              const successMessage =
                config.ui?.successMessages?.['otp-verified'] ||
                'Successfully signed in!'

              toast.success(successMessage)

              // Reload page for Convex to pick up auth state
              // Router will handle redirect based on new auth state
              if (!options.disableAutoNavigate) {
                window.location.reload()
              }

              options.onSuccess?.()
              config.onSuccess?.('otp-verified', { email })
            },
            onError: (ctx) => {
              const err = new Error(ctx.error.message)
              setError(err)
              handleError(err, 'verify code')
              options.onError?.(err)
            },
          }
        )
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to verify OTP')
        setError(error)
        handleError(error, 'verify code')
        options.onError?.(error)
      } finally {
        setIsLoading(false)
      }
    },
    [navigate, config, options, handleError]
  )

  /**
   * Resend OTP to last email
   */
  const resendOTP = useCallback(async () => {
    if (!lastEmail || countdown > 0) return
    await sendOTP(lastEmail)
  }, [lastEmail, countdown, sendOTP])

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setError(null)
    setOtpSent(false)
    setCountdown(0)
    setLastEmail('')
  }, [])

  return {
    /** Send OTP to email */
    sendOTP,

    /** Verify OTP code */
    verifyOTP,

    /** Resend OTP to last email */
    resendOTP,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Whether OTP was sent */
    otpSent,

    /** Whether resend is allowed (countdown finished) */
    canResend: countdown === 0 && !!lastEmail,

    /** Seconds remaining before resend allowed */
    countdown,

    /** Last email address used */
    lastEmail,

    /** Reset hook state */
    reset,
  }
}
