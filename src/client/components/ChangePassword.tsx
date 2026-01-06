// src/client/components/ChangePassword.tsx

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tanstack-monorepo/ui'
import { Input } from '@tanstack-monorepo/ui'
import { Label } from '@tanstack-monorepo/ui'
import { Checkbox } from '@tanstack-monorepo/ui'
import { authClient } from '../auth-client'
import { useState } from 'react'
import { toast } from 'sonner'
import { validatePassword, getPasswordRequirementsList } from '../../shared/config'
import type { PasswordRequirements } from '../../shared/config'
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'

export interface ChangePasswordProps {
  /**
   * Password requirements for validation
   * If not provided, only min/max length will be validated
   */
  passwordRequirements?: PasswordRequirements
  /**
   * Whether to show the session revocation checkbox
   * @default true
   */
  showRevokeSessionsOption?: boolean
  /**
   * Callback when password is successfully changed
   */
  onSuccess?: () => void
  /**
   * Callback when password change fails
   */
  onError?: (error: Error) => void
  /**
   * Whether to show the component in a card
   * @default true
   */
  showCard?: boolean
}

export function ChangePassword({
  passwordRequirements,
  showRevokeSessionsOption = true,
  onSuccess,
  onError,
  showCard = true,
}: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password validation
  const validation = passwordRequirements
    ? validatePassword(newPassword, passwordRequirements)
    : { valid: true, errors: [] }

  const passwordsMatch = newPassword === confirmPassword
  const canSubmit =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    validation.valid &&
    passwordsMatch &&
    !loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canSubmit) return

    setLoading(true)
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      })

      toast.success('Password changed successfully')

      // Clear form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setRevokeOtherSessions(false)

      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to change password'
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <div className="relative">
          <Input
            id="current-password"
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Password Requirements */}
        {passwordRequirements && newPassword && (
          <div className="text-xs space-y-1 mt-2">
            <p className="font-medium text-gray-700">Password must contain:</p>
            {getPasswordRequirementsList(passwordRequirements).map((req, idx) => {
              const isValid = validation.errors.length === 0 ||
                !validation.errors.some(err => err.toLowerCase().includes(req.toLowerCase().split(' ').slice(-2).join(' ')))
              return (
                <div key={idx} className="flex items-center gap-2">
                  {isValid ? (
                    <CheckCircle2 size={14} className="text-green-600" />
                  ) : (
                    <XCircle size={14} className="text-red-600" />
                  )}
                  <span className={isValid ? 'text-green-700' : 'text-red-700'}>
                    {req}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Validation Errors */}
        {newPassword && validation.errors.length > 0 && (
          <div className="text-xs text-red-600 space-y-1">
            {validation.errors.map((error, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <XCircle size={14} />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Password Match Indicator */}
        {confirmPassword && (
          <div className="flex items-center gap-2 text-xs">
            {passwordsMatch ? (
              <>
                <CheckCircle2 size={14} className="text-green-600" />
                <span className="text-green-700">Passwords match</span>
              </>
            ) : (
              <>
                <XCircle size={14} className="text-red-600" />
                <span className="text-red-700">Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Revoke Other Sessions Option */}
      {showRevokeSessionsOption && (
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="revoke-sessions"
            checked={revokeOtherSessions}
            onChange={(checked) => setRevokeOtherSessions(checked as boolean)}
            disabled={loading}
          />
          <Label
            htmlFor="revoke-sessions"
            className="text-sm font-normal cursor-pointer"
          >
            Sign out all other devices
          </Label>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={!canSubmit} className="w-full">
        {loading ? 'Changing Password...' : 'Change Password'}
      </Button>
    </form>
  )

  if (!showCard) {
    return content
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
