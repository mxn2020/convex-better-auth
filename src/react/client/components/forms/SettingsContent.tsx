// packages/convex-better-auth/src/client/components/forms/SettingsContent.tsx

/**
 * Settings content logic component
 * Handles all settings operations and view state management
 * Layout is handled by parent component
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '@tanstack-app/ui'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Mail,
  XCircle,
  Shield,
  Key,
} from 'lucide-react'
import { useState } from 'react'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../../hooks/utils/useAuthConfig'
import { useTwoFactorDisable } from '../../hooks/twoFactor/useTwoFactorDisable'
import EnableTwoFactorForm from './EnableTwoFactorForm'
import ChangePasswordForm from './ChangePasswordForm'
import { ResendVerificationForm } from './ResendVerificationForm'
import type { PasswordRequirements } from '../../../../shared/config'

export interface SettingsContentProps {
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
 * Settings content with all logic
 * This component handles view state management and settings operations
 * Composition of multiple form components with config-driven visibility
 *
 * @example
 * ```tsx
 * <SettingsContent
 *   passwordRequirements={{ minLength: 8, requireNumbers: true }}
 *   backLink="/dashboard"
 * />
 * ```
 */
export default function SettingsContent({
  passwordRequirements,
  showChangePassword,
  showEmailVerification,
  showTwoFactor,
  showAccountDeletion,
  backLink = '/',
}: SettingsContentProps) {
  const { config } = useAuthConfig()
  const navigate = useNavigate()
  const { disableTwoFactor, isLoading: disabling2FA } = useTwoFactorDisable()

  // View states
  const [showEnable2FA, setShowEnable2FA] = useState(false)
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)

  // Get user session
  const { data: session } = authClient.useSession()
  const user = session?.user
  const isEmailVerified = user?.emailVerified || false

  // Determine visibility from config or props
  const shouldShowChangePassword =
    showChangePassword ?? config.features?.showTwoFactor ?? true
  const shouldShowEmailVerification =
    showEmailVerification ?? config.features?.showEmailVerification ?? true
  const shouldShowTwoFactor =
    showTwoFactor ?? config.features?.showTwoFactor ?? true
  const shouldShowAccountDeletion =
    showAccountDeletion ?? config.features?.showAccountDeletion ?? true

  // Settings handlers
  const handleDisable2FA = async () => {
    const password = window.prompt('Enter your password to disable 2FA:')
    if (!password) return

    await disableTwoFactor(password)
  }

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      return
    }

    try {
      await authClient.deleteUser()
      void navigate({ to: '/' })
    } catch (error) {
      // Error handled by hook
    }
  }

  // Show Enable 2FA view
  if (showEnable2FA) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowEnable2FA(false)}
        >
          <ArrowLeft size={16} />
          Back to Settings
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Enable Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <EnableTwoFactorForm
              onBack={() => setShowEnable2FA(false)}
              onSuccess={() => setShowEnable2FA(false)}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show Change Password view
  if (showChangePasswordForm) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowChangePasswordForm(false)}
        >
          <ArrowLeft size={16} />
          Back to Settings
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Change Password
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ChangePasswordForm
              passwordRequirements={passwordRequirements}
              onSuccess={() => {
                setTimeout(() => setShowChangePasswordForm(false), 2000)
              }}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Settings view
  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        asChild
      >
        <Link to={backLink}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Settings</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Manage your account settings and security
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          {/* Email Verification Status */}
          {shouldShowEmailVerification && user?.email && (
            <div className="grid gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Mail size={16} />
                    Email Verification
                  </h3>
                  {isEmailVerified ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 size={12} className="mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle size={12} className="mr-1" />
                      Not Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {isEmailVerified
                    ? `Your email ${user.email} is verified.`
                    : `Please verify your email ${user.email} to secure your account.`}
                </p>
                {!isEmailVerified && (
                  <ResendVerificationForm
                    email={user.email}
                    variant="outline"
                    size="sm"
                  />
                )}
              </div>
            </div>
          )}

          {/* Change Password */}
          {shouldShowChangePassword && (
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                  <Key size={16} />
                  Password
                </h3>
                <p className="text-sm text-muted-foreground">
                  Update your password to keep your account secure.
                </p>
              </div>
              <div>
                <Button
                  onClick={() => setShowChangePasswordForm(true)}
                  variant="outline"
                >
                  Change Password
                </Button>
              </div>
            </div>
          )}

          {/* Two-Factor Authentication */}
          {shouldShowTwoFactor && (
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                  <Shield size={16} />
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by requiring a
                  verification code in addition to your password.
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowEnable2FA(true)}>
                  Enable 2FA
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDisable2FA}
                  disabled={disabling2FA}
                >
                  {disabling2FA ? 'Disabling...' : 'Disable 2FA'}
                </Button>
              </div>
            </div>
          )}

          {/* Delete Account */}
          {shouldShowAccountDeletion && (
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                  Delete Account
                  <AlertTriangle size={14} className="text-destructive" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <div>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <div className="flex justify-center w-full border-t py-4">
            <p className="text-center text-xs text-neutral-500">
              Powered by{' '}
              <a
                href="https://better-auth.com"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="dark:text-orange-200/90">better-auth.</span>
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
