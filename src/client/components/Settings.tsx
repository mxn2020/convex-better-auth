// src/client/components/Settings.tsx

import EnableTwoFactor from './EnableTwoFactor'
import { ChangePassword } from './ChangePassword'
import { ResendVerification } from './ResendVerification'
import { Button } from '@tanstack-app/ui'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tanstack-app/ui'
import { Badge } from '@tanstack-app/ui'
import { authClient } from '../auth-client'
import { Link, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, ArrowLeft, CheckCircle2, Mail, XCircle, Shield, Key } from 'lucide-react'
import { useState } from 'react'
import type { PasswordRequirements } from '../../shared/config'

export interface SettingsPageProps {
  /**
   * Password requirements for validation in change password form
   */
  passwordRequirements?: PasswordRequirements
  /**
   * Whether to show the change password section
   * @default true
   */
  showChangePassword?: boolean
  /**
   * Whether to show email verification status
   * @default true
   */
  showEmailVerification?: boolean
  /**
   * Whether to show 2FA section
   * @default true
   */
  showTwoFactor?: boolean
  /**
   * Whether to show account deletion section
   * @default true
   */
  showAccountDeletion?: boolean
  /**
   * Back button link path
   * @default '/'
   */
  backLink?: string
}

export default function SettingsPage({
  passwordRequirements,
  showChangePassword = true,
  showEmailVerification = true,
  showTwoFactor = true,
  showAccountDeletion = true,
  backLink = '/',
}: SettingsPageProps) {
  const [showEnable2FA, setShowEnable2FA] = useState(false)
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Get user session to check email verification status
  const { data: session } = authClient.useSession()
  const user = session?.user
  const isEmailVerified = user?.emailVerified || false

  const handleDisable2FA = async () => {
    try {
      throw new Error('Not implemented')
      setLoading(true)
      await authClient.twoFactor.disable({
        password: '',
      })
    } catch {
      alert('Failed to disable 2FA. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      try {
        await authClient.deleteUser()
        void navigate({ to: '/' })
      } catch {
        alert('Failed to delete account. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      {showEnable2FA ? (
        <EnableTwoFactor onBack={() => setShowEnable2FA(false)} />
      ) : showChangePasswordForm ? (
        <div className="w-full max-w-md space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowChangePasswordForm(false)}
          >
            <ArrowLeft size={16} />
            Back to Settings
          </Button>
          <ChangePassword
            passwordRequirements={passwordRequirements}
            onSuccess={() => {
              // Optionally go back to settings after successful password change
              setTimeout(() => setShowChangePasswordForm(false), 2000)
            }}
          />
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
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
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Settings</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Manage your account settings and security
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Email Verification Status */}
              {showEmailVerification && user?.email && (
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
                      <ResendVerification
                        email={user.email}
                        callbackURL={window.location.origin}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Change Password */}
              {showChangePassword && (
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
              {showTwoFactor && (
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                      <Shield size={16} />
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account by requiring
                      a verification code in addition to your password.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowEnable2FA(true)}
                      disabled={loading}
                    >
                      Enable 2FA
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDisable2FA}
                      disabled={loading}
                    >
                      Disable 2FA
                    </Button>
                  </div>
                </div>
              )}

              {/* Delete Account */}
              {showAccountDeletion && (
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                      Delete Account
                      <AlertTriangle size={14} className="text-destructive" />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
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
                  >
                    <span className="dark:text-orange-200/90">
                      better-auth.
                    </span>
                  </a>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
