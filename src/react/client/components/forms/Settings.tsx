// packages/convex-better-auth/src/client/components/forms/Settings.tsx

/**
 * Settings Page Component
 * Handles layout and design for the settings page
 * Manages navigation between different setting sections
 */

import SettingsContent from './SettingsContent'
import type { PasswordRequirements } from '../../../../shared/config'

export interface SettingsProps {
  /** Password requirements for change password form */
  passwordRequirements?: PasswordRequirements

  /** Whether to show change password section (overrides config) */
  showChangePassword?: boolean

  /** Whether to show email verification (overrides config) */
  showEmailVerification?: boolean

  /** Whether to show 2FA section (overrides config) */
  showTwoFactor?: boolean

  /** Whether to show account deletion (overrides config) */
  showAccountDeletion?: boolean

  /** Back button link path */
  backLink?: string
}

/**
 * Settings page component with layout
 * Use this in your TanStack Router routes
 *
 * @example
 * ```tsx
 * // In your route file:
 * import { Settings } from '@convex-better-auth/client'
 *
 * export const Route = createFileRoute('/settings')({
 *   component: Settings,
 *   beforeLoad: ({ context }) => {
 *     if (!context.isAuthenticated) {
 *       throw redirect({ to: '/sign-in' })
 *     }
 *   },
 * })
 * ```
 */
export function Settings({
  passwordRequirements,
  showChangePassword,
  showEmailVerification,
  showTwoFactor,
  showAccountDeletion,
  backLink = '/',
}: SettingsProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SettingsContent
          passwordRequirements={passwordRequirements}
          showChangePassword={showChangePassword}
          showEmailVerification={showEmailVerification}
          showTwoFactor={showTwoFactor}
          showAccountDeletion={showAccountDeletion}
          backLink={backLink}
        />
      </div>
    </div>
  )
}

export default Settings
