// packages/convex-better-auth/src/client/components/forms/ResendVerification.tsx

/**
 * Resend Verification Page Component
 * Handles layout and design for the resend verification page
 * Form logic is delegated to ResendVerificationForm
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tanstack-app/ui'
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
 * import { ResendVerification } from '@convex-better-auth/client'
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
export function ResendVerification({
  email,
  cooldownSeconds = 60,
  onSuccess,
  onError,
  persistCooldown = true,
}: ResendVerificationProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              We've sent a verification email to <strong>{email}</strong>. Click
              the link in the email to verify your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or click below
                to resend.
              </p>

              <ResendVerificationForm
                email={email}
                cooldownSeconds={cooldownSeconds}
                onSuccess={onSuccess}
                onError={onError}
                persistCooldown={persistCooldown}
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
