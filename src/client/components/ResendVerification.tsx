// src/client/components/ResendVerification.tsx

import { Button } from '@tanstack-monorepo/ui'
import { authClient } from '../auth-client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Mail, Clock } from 'lucide-react'

export interface ResendVerificationProps {
  /**
   * User's email address
   */
  email: string
  /**
   * Cooldown period in seconds before allowing resend
   * @default 60
   */
  cooldownSeconds?: number
  /**
   * Callback URL to redirect after verification
   */
  callbackURL?: string
  /**
   * Callback when email is successfully sent
   */
  onSuccess?: () => void
  /**
   * Callback when email sending fails
   */
  onError?: (error: Error) => void
  /**
   * Button variant
   * @default 'outline'
   */
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  /**
   * Button size
   * @default 'default'
   */
  size?: 'default' | 'sm' | 'lg'
  /**
   * Custom button text
   */
  buttonText?: string
}

export function ResendVerification({
  email,
  cooldownSeconds = 60,
  callbackURL,
  onSuccess,
  onError,
  variant = 'outline',
  size = 'default',
  buttonText,
}: ResendVerificationProps) {
  const [loading, setLoading] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [lastSentTime, setLastSentTime] = useState<number | null>(null)

  // Load last sent time from localStorage
  useEffect(() => {
    const storageKey = `resend_verification_${email}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const lastSent = parseInt(stored, 10)
      const now = Date.now()
      const elapsed = Math.floor((now - lastSent) / 1000)
      const remaining = Math.max(0, cooldownSeconds - elapsed)
      setCooldownRemaining(remaining)
      setLastSentTime(lastSent)
    }
  }, [email, cooldownSeconds])

  // Countdown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setInterval(() => {
        setCooldownRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [cooldownRemaining])

  const handleResend = async () => {
    if (cooldownRemaining > 0 || loading) return

    setLoading(true)
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: callbackURL || window.location.origin,
      })

      const now = Date.now()
      const storageKey = `resend_verification_${email}`
      localStorage.setItem(storageKey, now.toString())
      setLastSentTime(now)
      setCooldownRemaining(cooldownSeconds)

      toast.success('Verification email sent! Check your inbox.')
      onSuccess?.()
    } catch (error: any) {
      const errorMessage =
        error?.message || 'Failed to send verification email'
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = loading || cooldownRemaining > 0

  return (
    <Button
      onClick={handleResend}
      disabled={isDisabled}
      variant={variant}
      size={size}
      className="gap-2"
    >
      {loading ? (
        <>
          <Mail className="animate-pulse" size={16} />
          Sending...
        </>
      ) : cooldownRemaining > 0 ? (
        <>
          <Clock size={16} />
          Resend in {cooldownRemaining}s
        </>
      ) : (
        <>
          <Mail size={16} />
          {buttonText || 'Resend Verification Email'}
        </>
      )}
    </Button>
  )
}

/**
 * Inline version without button styling
 * Useful for embedding in text
 */
export function ResendVerificationLink({
  email,
  cooldownSeconds = 60,
  callbackURL,
  onSuccess,
  onError,
  className,
}: ResendVerificationProps & { className?: string }) {
  const [loading, setLoading] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  // Load last sent time from localStorage
  useEffect(() => {
    const storageKey = `resend_verification_${email}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const lastSent = parseInt(stored, 10)
      const now = Date.now()
      const elapsed = Math.floor((now - lastSent) / 1000)
      const remaining = Math.max(0, cooldownSeconds - elapsed)
      setCooldownRemaining(remaining)
    }
  }, [email, cooldownSeconds])

  // Countdown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setInterval(() => {
        setCooldownRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [cooldownRemaining])

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (cooldownRemaining > 0 || loading) return

    setLoading(true)
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: callbackURL || window.location.origin,
      })

      const now = Date.now()
      const storageKey = `resend_verification_${email}`
      localStorage.setItem(storageKey, now.toString())
      setCooldownRemaining(cooldownSeconds)

      toast.success('Verification email sent! Check your inbox.')
      onSuccess?.()
    } catch (error: any) {
      const errorMessage =
        error?.message || 'Failed to send verification email'
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = loading || cooldownRemaining > 0

  if (loading) {
    return <span className={className}>Sending...</span>
  }

  if (cooldownRemaining > 0) {
    return (
      <span className={className}>
        Resend in {cooldownRemaining}s
      </span>
    )
  }

  return (
    <button
      onClick={handleResend}
      disabled={isDisabled}
      className={`underline hover:no-underline ${className || ''}`}
    >
      Resend verification email
    </button>
  )
}
