// packages/convex-better-auth/src/client/components/forms/ResetPasswordForm.tsx

/**
 * Reset password form logic component
 * Handles password reset form state and submission
 * Layout is handled by parent component
 */

import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { useNavigate } from '@tanstack/react-router'
import { usePasswordReset } from '../../hooks/password/usePasswordReset'
import {
  passwordResetSchema,
  type PasswordResetFormData,
} from '../../utils/validation'
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
export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const navigate = useNavigate()

  const { resetPassword, isLoading } = usePasswordReset({
    onResetSuccess: () => {
      void navigate({ to: '/' })
    },
  })

  const form = useForm<PasswordResetFormData>({
    resolver: zodValidator(passwordResetSchema),
    defaultValues: {
      token: token || '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Auth handler
  const onSubmit = form.handleSubmit(async (data) => {
    await resetPassword(data.token, data.newPassword)
  })

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {/* New Password Field */}
      <FormField
        label="New Password"
        type="password"
        placeholder="Enter your new password"
        disabled={isLoading}
        {...form.register('newPassword')}
        error={form.formState.errors.newPassword?.message}
      />

      {/* Confirm Password Field */}
      <FormField
        label="Confirm Password"
        type="password"
        placeholder="Confirm your new password"
        disabled={isLoading}
        {...form.register('confirmPassword')}
        error={form.formState.errors.confirmPassword?.message}
      />

      {/* Submit Button */}
      <LoadingButton type="submit" className="w-full" isLoading={isLoading}>
        Reset Password
      </LoadingButton>
    </form>
  )
}
