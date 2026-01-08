// packages/convex-better-auth/src/client/components/forms/ChangePasswordForm.tsx

/**
 * Change password form logic component
 * Handles password change form state and validation
 * Layout is handled by parent component
 */

import { Checkbox, Label } from '@tanstack-app/ui'
import { useForm } from '@tanstack/react-form'
import { CheckCircle2, XCircle } from 'lucide-react'
import { usePasswordChange } from '../../hooks/password/usePasswordChange'
import { usePasswordValidation } from '../../hooks/password/usePasswordValidation'
import { PasswordInput } from '../base/PasswordInput'
import { LoadingButton } from '../base'
import type { PasswordRequirements } from '../../../../shared/config'
import { useState } from 'react'

export interface ChangePasswordFormProps {
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
 * Change password form with all logic
 * This component only handles the form and password change operations
 *
 * @example
 * ```tsx
 * <ChangePasswordForm
 *   passwordRequirements={{
 *     minLength: 8,
 *     requireUppercase: true,
 *     requireNumbers: true,
 *   }}
 *   showRevokeSessionsOption
 * />
 * ```
 */
export default function ChangePasswordForm({
  passwordRequirements,
  showRevokeSessionsOption = true,
  onSuccess,
  onError,
}: ChangePasswordFormProps) {
  const { changePassword, isLoading, success } = usePasswordChange({
    onSuccess,
    onError,
  })

  const { validate, getRequirementsList } =
    usePasswordValidation(passwordRequirements)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      revokeOtherSessions: false,
    },
    onSubmit: async ({ value }) => {
      await changePassword(
        value.currentPassword,
        value.newPassword,
        value.revokeOtherSessions
      )

      // Clear form on success
      if (success) {
        form.reset()
        setNewPassword('')
        setConfirmPassword('')
      }
    },
  })

  // Validate password with custom requirements
  const validation = passwordRequirements
    ? validate(newPassword)
    : { valid: true, errors: [] }

  const passwordsMatch = newPassword === confirmPassword
  const requirements = passwordRequirements ? getRequirementsList() : []

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="grid gap-4"
    >
      {/* Current Password Field */}
      <form.Field name="currentPassword">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <PasswordInput
              id="current-password"
              placeholder="Enter current password"
              disabled={isLoading}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors?.[0] && (
              <p className="text-xs text-red-600">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* New Password Field */}
      <form.Field name="newPassword">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <PasswordInput
              id="new-password"
              placeholder="Enter new password"
              disabled={isLoading}
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value)
                setNewPassword(e.target.value)
              }}
              onBlur={field.handleBlur}
            />

        {/* Password Requirements */}
        {passwordRequirements && newPassword && (
          <div className="text-xs space-y-1 mt-2">
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Password must contain:
            </p>
            {requirements.map((req, idx) => {
              const isValid =
                validation.valid ||
                !validation.errors.some((err) =>
                  err
                    .toLowerCase()
                    .includes(req.toLowerCase().split(' ').slice(-2).join(' '))
                )
              return (
                <div key={idx} className="flex items-center gap-2">
                  {isValid ? (
                    <CheckCircle2 size={14} className="text-green-600" />
                  ) : (
                    <XCircle size={14} className="text-red-600" />
                  )}
                  <span
                    className={
                      isValid
                        ? 'text-green-700 dark:text-green-500'
                        : 'text-red-700 dark:text-red-500'
                    }
                  >
                    {req}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Validation Errors */}
        {newPassword && validation.errors.length > 0 && (
          <div className="text-xs text-red-600 dark:text-red-500 space-y-1">
            {validation.errors.map((error, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <XCircle size={14} />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}

            {field.state.meta.errors?.[0] && (
              <p className="text-xs text-red-600">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Confirm Password Field */}
      <form.Field name="confirmPassword">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <PasswordInput
              id="confirm-password"
              placeholder="Confirm new password"
              disabled={isLoading}
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value)
                setConfirmPassword(e.target.value)
              }}
              onBlur={field.handleBlur}
            />

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="flex items-center gap-2 text-xs">
                {passwordsMatch ? (
                  <>
                    <CheckCircle2 size={14} className="text-green-600" />
                    <span className="text-green-700 dark:text-green-500">
                      Passwords match
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} className="text-red-600" />
                    <span className="text-red-700 dark:text-red-500">
                      Passwords do not match
                    </span>
                  </>
                )}
              </div>
            )}

            {field.state.meta.errors?.[0] && (
              <p className="text-xs text-red-600">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Revoke Other Sessions Option */}
      {showRevokeSessionsOption && (
        <form.Field name="revokeOtherSessions">
          {(field) => (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="revoke-sessions"
                checked={field.state.value}
                onChange={(checked) => field.handleChange(checked)}
                disabled={isLoading}
              />
              <Label
                htmlFor="revoke-sessions"
                className="text-sm font-normal cursor-pointer"
              >
                Sign out all other devices
              </Label>
            </div>
          )}
        </form.Field>
      )}

      {/* Submit Button */}
      <LoadingButton
        type="submit"
        className="w-full"
        isLoading={isLoading}
        loadingText="Changing Password..."
      >
        Change Password
      </LoadingButton>
    </form>
  )
}
