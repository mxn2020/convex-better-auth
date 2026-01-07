// packages/convex-better-auth/src/solid/client/components/forms/ResetPasswordForm.tsx

/**
 * Reset password form logic component for Solid
 * Handles password reset form state and submission
 * Layout is handled by parent component
 */

import { createSignal, type Component } from 'solid-js'
import { useNavigate } from '@tanstack/solid-router'
import { createPasswordReset } from '../../composables/password/createPasswordReset'
import { FormField, LoadingButton } from '../base'

export interface ResetPasswordFormProps {
  /** Reset token from URL */
  token: string
}

/**
 * Reset password form with all logic
 * This component only handles the form and reset operations
 *
 * @example
 * ```tsx
 * <ResetPasswordForm token="abc123" />
 * ```
 */
export const ResetPasswordForm: Component<ResetPasswordFormProps> = (props) => {
  const navigate = useNavigate()

  const { resetPassword, isLoading } = createPasswordReset({
    onResetSuccess: () => {
      navigate({ to: '/' })
    },
  })

  const [newPassword, setNewPassword] = createSignal('')
  const [confirmPassword, setConfirmPassword] = createSignal('')
  const [errors, setErrors] = createSignal<{
    newPassword?: string
    confirmPassword?: string
  }>({})

  // Auth handler
  const onSubmit = async (e: Event) => {
    e.preventDefault()

    const newErrors: {
      newPassword?: string
      confirmPassword?: string
    } = {}

    if (!newPassword()) {
      newErrors.newPassword = 'New password is required'
    } else if (newPassword().length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }

    if (!confirmPassword()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (newPassword() !== confirmPassword()) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    await resetPassword(props.token, newPassword())
  }

  return (
    <form onSubmit={onSubmit} class="grid gap-4">
      {/* New Password Field */}
      <FormField
        label="New Password"
        type="password"
        placeholder="Enter your new password"
        disabled={isLoading()}
        value={newPassword()}
        onInput={(e: InputEvent) => setNewPassword((e.target as HTMLInputElement).value)}
        error={errors().newPassword}
      />

      {/* Confirm Password Field */}
      <FormField
        label="Confirm Password"
        type="password"
        placeholder="Confirm your new password"
        disabled={isLoading()}
        value={confirmPassword()}
        onInput={(e: InputEvent) => setConfirmPassword((e.target as HTMLInputElement).value)}
        error={errors().confirmPassword}
      />

      {/* Submit Button */}
      <LoadingButton type="submit" class="w-full" isLoading={isLoading()}>
        Reset Password
      </LoadingButton>
    </form>
  )
}

export default ResetPasswordForm
