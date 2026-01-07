// packages/convex-better-auth/src/solid/client/components/forms/ResendVerification.tsx

/**
 * Resend Verification Page Component for Solid
 * Handles layout and design for the resend verification page
 * Form logic is delegated to ResendVerificationForm
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tanstack-app/ui/solid'
import { type Component } from 'solid-js'
import { ResendVerificationForm } from './ResendVerificationForm'

export interface ResendVerificationProps {
  /** User's email address */
  email: string

  /** Cooldown period in seconds (default: 60) */
  cooldownSeconds?: number

  /** Callback when email is successfully sent */
  onSuccess?: () => void

  /** Callback when email sending fails */
  onError?: (error: Error) => void

  /** Whether to persist cooldown in localStorage */
  persistCooldown?: boolean
}

/**
 * Resend Verification page component with layout
 * Use this in your TanStack Router routes or when you need a full page
 *
 * @example
 * ```tsx
 * // In your route file:
 * import { ResendVerification } from '@convex-better-auth/solid/client/forms'
 *
 * export const Route = createFileRoute('/verify-email')({
 *   component: () => (
 *     <ResendVerification
 *       email="user@example.com"
 *       cooldownSeconds={60}
 *     />
 *   ),
 * })
 * ```
 */
export const ResendVerification: Component<ResendVerificationProps> = (props) => {
  return (
    <div class="min-h-screen w-full flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle class="text-lg md:text-xl">
              Verify Your Email
            </CardTitle>
            <CardDescription class="text-xs md:text-sm">
              We've sent a verification email to <strong>{props.email}</strong>. Click
              the link in the email to verify your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div class="grid gap-4">
              <p class="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or click below
                to resend.
              </p>

              <ResendVerificationForm
                email={props.email}
                cooldownSeconds={props.cooldownSeconds ?? 60}
                onSuccess={props.onSuccess}
                onError={props.onError}
                persistCooldown={props.persistCooldown ?? true}
                variant="default"
                size="default"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResendVerification
