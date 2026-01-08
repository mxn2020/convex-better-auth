// packages/convex-better-auth/src/client/components/forms/ResetPasswordForm.tsx

/**
 * Reset password form logic component
 * Handles password reset form state and submission
 * Layout is handled by parent component
 */

import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { usePasswordReset } from '../../hooks/password/usePasswordReset'
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

  const form = useForm({
    defaultValues: {
      token: token || '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      await resetPassword(value.token, value.newPassword)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="grid gap-4"
    >
      {/* New Password Field */}
      <form.Field name="newPassword">
        {(field) => (
          <FormField
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            disabled={isLoading}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors?.[0] ? String(field.state.meta.errors[0]) : undefined}
          />
        )}
      </form.Field>

      {/* Confirm Password Field */}
      <form.Field name="confirmPassword">
        {(field) => (
          <FormField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            disabled={isLoading}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors?.[0] ? String(field.state.meta.errors[0]) : undefined}
          />
        )}
      </form.Field>

      {/* Submit Button */}
      <LoadingButton type="submit" className="w-full" isLoading={isLoading}>
        Reset Password
      </LoadingButton>
    </form>
  )
}
