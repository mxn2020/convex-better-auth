// packages/convex-better-auth/src/solid/client/components/forms/SettingsContent.tsx

/**
 * Settings content logic component
 * Handles all settings operations and view state management
 * Layout is handled by parent component
 */

import type { Component, JSX } from 'solid-js'
import { createSignal, Show } from 'solid-js'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '@tanstack-app/ui/solid'
import { Link, useNavigate } from '@tanstack/solid-router'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Mail,
  XCircle,
  Shield,
  Key,
} from 'lucide-solid'
import { authClient } from '../../auth-client'
import { createAuthConfig } from '../../composables/utils/createAuthConfig'
import { createTwoFactorDisable } from '../../composables/twoFactor/createTwoFactorDisable'
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

export const SettingsContent: Component<SettingsContentProps> = (props) => {
  const { config } = createAuthConfig()
  const navigate = useNavigate()
  const { disableTwoFactor, isLoading: disabling2FA } = createTwoFactorDisable()

  // View states
  const [showEnable2FA, setShowEnable2FA] = createSignal(false)
  const [showChangePasswordForm, setShowChangePasswordForm] = createSignal(false)

  // Get user session
  const session = authClient.useSession()
  const user = () => session()?.data?.user
  const isEmailVerified = () => user()?.emailVerified || false

  // Determine visibility from config or props
  const shouldShowChangePassword = () =>
    props.showChangePassword ?? config().features?.showTwoFactor ?? true
  const shouldShowEmailVerification = () =>
    props.showEmailVerification ?? config().features?.showEmailVerification ?? true
  const shouldShowTwoFactor = () =>
    props.showTwoFactor ?? config().features?.showTwoFactor ?? true
  const shouldShowAccountDeletion = () =>
    props.showAccountDeletion ?? config().features?.showAccountDeletion ?? true

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
      navigate({ to: '/' })
    } catch (error) {
      // Error handled by hook
    }
  }

  // Show Enable 2FA view
  if (showEnable2FA()) {
    return (
      <div class="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          class="flex items-center gap-2"
          onclick={() => setShowEnable2FA(false)}
        >
          <ArrowLeft size={16} />
          Back to Settings
        </Button>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg md:text-xl">
              Enable Two-Factor Authentication
            </CardTitle>
            <CardDescription class="text-xs md:text-sm">
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
  if (showChangePasswordForm()) {
    return (
      <div class="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          class="flex items-center gap-2"
          onclick={() => setShowChangePasswordForm(false)}
        >
          <ArrowLeft size={16} />
          Back to Settings
        </Button>

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
    <div class="space-y-4">
      <Button variant="ghost" size="sm" onclick={() => navigate({ to: props.backLink ?? '/' })}>
        <ArrowLeft size={16} />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle class="text-lg md:text-xl">Settings</CardTitle>
          <CardDescription class="text-xs md:text-sm">
            Manage your account settings and security
          </CardDescription>
        </CardHeader>

        <CardContent class="grid gap-6">
          {/* Email Verification Status */}
          <Show when={shouldShowEmailVerification() && user()?.email}>
            <div class="grid gap-4">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-medium flex items-center gap-2">
                    <Mail size={16} />
                    Email Verification
                  </h3>
                  <Show
                    when={isEmailVerified()}
                    fallback={
                      <Badge variant="destructive">
                        <XCircle size={12} class="mr-1" />
                        Not Verified
                      </Badge>
                    }
                  >
                    <Badge variant="default" class="bg-green-600">
                      <CheckCircle2 size={12} class="mr-1" />
                      Verified
                    </Badge>
                  </Show>
                </div>
                <p class="text-sm text-muted-foreground mb-2">
                  {isEmailVerified()
                    ? `Your email ${user()?.email} is verified.`
                    : `Please verify your email ${user()?.email} to secure your account.`}
                </p>
                <Show when={!isEmailVerified()}>
                  <ResendVerificationForm
                    email={user()?.email!}
                    variant="outline"
                    size="sm"
                  />
                </Show>
              </div>
            </div>
          </Show>

          {/* Change Password */}
          <Show when={shouldShowChangePassword()}>
            <div class="grid gap-4">
              <div>
                <h3 class="text-sm font-medium mb-1 flex items-center gap-2">
                  <Key size={16} />
                  Password
                </h3>
                <p class="text-sm text-muted-foreground">
                  Update your password to keep your account secure.
                </p>
              </div>
              <div>
                <Button
                  onclick={() => setShowChangePasswordForm(true)}
                  variant="outline"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </Show>

          {/* Two-Factor Authentication */}
          <Show when={shouldShowTwoFactor()}>
            <div class="grid gap-4">
              <div>
                <h3 class="text-sm font-medium mb-1 flex items-center gap-2">
                  <Shield size={16} />
                  Two-Factor Authentication
                </h3>
                <p class="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by requiring a
                  verification code in addition to your password.
                </p>
              </div>
              <div class="flex gap-2">
                <Button onclick={() => setShowEnable2FA(true)}>
                  Enable 2FA
                </Button>
                <Button
                  variant="destructive"
                  onclick={handleDisable2FA}
                  disabled={disabling2FA()}
                >
                  {disabling2FA() ? 'Disabling...' : 'Disable 2FA'}
                </Button>
              </div>
            </div>
          </Show>

          {/* Delete Account */}
          <Show when={shouldShowAccountDeletion()}>
            <div class="grid gap-4">
              <div>
                <h3 class="text-sm font-medium mb-1 flex items-center gap-2">
                  Delete Account
                  <AlertTriangle size={14} class="text-destructive" />
                </h3>
                <p class="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <div>
                <Button variant="destructive" onclick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
            </div>
          </Show>
        </CardContent>

        <CardFooter>
          <div class="flex justify-center w-full border-t py-4">
            <p class="text-center text-xs text-neutral-500">
              Powered by{' '}
              <a
                href="https://better-auth.com"
                class="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="dark:text-orange-200/90">better-auth.</span>
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
