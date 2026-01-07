// src/solid/client/components/forms/ChangePassword.tsx

/**
 * Change Password Page Component
 * Handles layout and design for the password change page
 * Form logic is delegated to ChangePasswordForm
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tanstack-app/ui/solid'
import { ChangePasswordForm } from './ChangePasswordForm'
import type { PasswordRequirements } from '../../../../shared/config'

export interface ChangePasswordProps {
  /** Password requirements for validation */
  passwordRequirements?: PasswordRequirements

  /** Whether to show the session revocation checkbox */
  showRevokeSessionsOption?: boolean

  /** Callback when password is successfully changed */
  onSuccess?: () => void

  /** Callback when password change fails */
  onError?: (error: Error) => void
}

/**
 * Change Password page component with layout
 * Use this in your TanStack Router routes or settings pages
 *
 * @example
 * ```tsx
 * // In your route file:
 * import { ChangePassword } from '@convex-better-auth/solid-client'
 *
 * export const Route = createFileRoute('/settings/password')({
 *   component: () => (
 *     <ChangePassword
 *       passwordRequirements={{
 *         minLength: 8,
 *         requireUppercase: true,
 *         requireNumbers: true,
 *       }}
 *       showRevokeSessionsOption
 *     />
 *   ),
 * })
 * ```
 */
export function ChangePassword(props: ChangePasswordProps) {
  return (
    <div class="min-h-screen w-full flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle class="text-lg md:text-xl">Change Password</CardTitle>
            <CardDescription class="text-xs md:text-sm">
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ChangePasswordForm
              passwordRequirements={props.passwordRequirements}
              showRevokeSessionsOption={props.showRevokeSessionsOption}
              onSuccess={props.onSuccess}
              onError={props.onError}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ChangePassword
