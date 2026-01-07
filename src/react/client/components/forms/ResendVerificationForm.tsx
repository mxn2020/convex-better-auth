// packages/convex-better-auth/src/client/components/forms/ResendVerificationForm.tsx

/**
 * Resend verification email component logic
 * Uses useResendVerification hook for all business logic
 * Layout is handled by parent component or inline usage
 */

import { Button } from '@tanstack-app/ui'
import { Mail, Clock } from 'lucide-react'
import { useResendVerification } from '../../hooks/verification/useResendVerification'

export interface ResendVerificationFormProps {
  /** User's email address */
  email: string

  /** Cooldown period in seconds (default: 60) */
  cooldownSeconds?: number

  /** Callback when email is successfully sent */
  onSuccess?: () => void

  /** Callback when email sending fails */
  onError?: (error: Error) => void

  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost' | 'link'

  /** Button size */
  size?: 'default' | 'sm' | 'lg'

  /** Custom button text */
  buttonText?: string

  /** Whether to persist cooldown in localStorage */
  persistCooldown?: boolean
}

/**
 * Resend verification email button
 * This component only handles the resend logic
 *
 * @example
 * ```tsx
 * <ResendVerificationForm
 *   email="user@example.com"
 *   cooldownSeconds={60}
 * />
 * ```
 */
export function ResendVerificationForm({
  email,
  cooldownSeconds = 60,
  onSuccess,
  onError,
  variant = 'outline',
  size = 'default',
  buttonText,
  persistCooldown = true,
}: ResendVerificationFormProps) {
  const { resendVerification, isLoading, canResend, countdown } =
    useResendVerification({
      cooldownSeconds,
      onSuccess,
      onError,
      persistCooldown,
    })

  const isDisabled = !canResend || isLoading

  // Auth handler
  const handleResend = () => {
    resendVerification(email)
  }

  return (
    <Button
      onClick={handleResend}
      disabled={isDisabled}
      variant={variant}
      size={size}
      className="gap-2"
    >
      {isLoading ? (
        <>
          <Mail className="animate-pulse" size={16} />
          Sending...
        </>
      ) : !canResend ? (
        <>
          <Clock size={16} />
          Resend in {countdown}s
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
 * Inline link version for embedding in text
 * This component only handles the resend logic
 *
 * @example
 * ```tsx
 * <p>
 *   Didn't receive the email?{' '}
 *   <ResendVerificationLink email="user@example.com" />
 * </p>
 * ```
 */
export function ResendVerificationLink({
  email,
  cooldownSeconds = 60,
  onSuccess,
  onError,
  className,
  persistCooldown = true,
}: ResendVerificationFormProps & { className?: string }) {
  const { resendVerification, isLoading, canResend, countdown } =
    useResendVerification({
      cooldownSeconds,
      onSuccess,
      onError,
      persistCooldown,
    })

  // Auth handler
  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault()
    resendVerification(email)
  }

  if (isLoading) {
    return <span className={className}>Sending...</span>
  }

  if (!canResend) {
    return <span className={className}>Resend in {countdown}s</span>
  }

  return (
    <button
      onClick={handleResend}
      className={`underline hover:no-underline ${className || ''}`}
    >
      Resend verification email
    </button>
  )
}

export default ResendVerificationForm
