// packages/convex-better-auth/src/solid/client/components/forms/ResendVerificationForm.tsx

/**
 * Resend verification email component logic for Solid
 * Uses createResendVerification hook for all business logic
 * Layout is handled by parent component or inline usage
 */

import { Button } from '@tanstack-app/ui/solid'
import Mail from 'lucide-solid/icons/mail'
import Clock from 'lucide-solid/icons/clock'
import { Show, type Component } from 'solid-js'
import { createResendVerification } from '../../composables/verification/createResendVerification'

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
export const ResendVerificationForm: Component<ResendVerificationFormProps> = (props) => {
  const { resendVerification, isLoading, canResend, countdown } =
    createResendVerification({
      cooldownSeconds: props.cooldownSeconds ?? 60,
      onSuccess: props.onSuccess,
      onError: props.onError,
      persistCooldown: props.persistCooldown ?? true,
    })

  const isDisabled = () => !canResend() || isLoading()

  // Auth handler
  const handleResend = () => {
    resendVerification(props.email)
  }

  return (
    <Button
      onClick={handleResend}
      disabled={isDisabled()}
      variant={props.variant ?? 'outline'}
      size={props.size ?? 'default'}
      class="gap-2"
    >
      <Show
        when={isLoading()}
        fallback={
          <Show
            when={!canResend()}
            fallback={
              <>
                <Mail size={16} />
                {props.buttonText || 'Resend Verification Email'}
              </>
            }
          >
            <Clock size={16} />
            Resend in {countdown()}s
          </Show>
        }
      >
        <Mail class="animate-pulse" size={16} />
        Sending...
      </Show>
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
export const ResendVerificationLink: Component<
  ResendVerificationFormProps & { class?: string }
> = (props) => {
  const { resendVerification, isLoading, canResend, countdown } =
    createResendVerification({
      cooldownSeconds: props.cooldownSeconds ?? 60,
      onSuccess: props.onSuccess,
      onError: props.onError,
      persistCooldown: props.persistCooldown ?? true,
    })

  // Auth handler
  const handleResend = (e: MouseEvent) => {
    e.preventDefault()
    resendVerification(props.email)
  }

  return (
    <Show
      when={isLoading()}
      fallback={
        <Show
          when={!canResend()}
          fallback={
            <button
              onClick={handleResend}
              class={`underline hover:no-underline ${props.class || ''}`}
            >
              Resend verification email
            </button>
          }
        >
          <span class={props.class}>Resend in {countdown()}s</span>
        </Show>
      }
    >
      <span class={props.class}>Sending...</span>
    </Show>
  )
}

export default ResendVerificationForm
