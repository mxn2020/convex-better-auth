// src/solid/client/components/forms/ChangePasswordForm.tsx

/**
 * Change password form logic component using TanStack Form
 * Handles password change form state and validation
 */

import { Checkbox, Label } from '@tanstack-app/ui/solid'
import { createForm, type FormApi } from '@tanstack/solid-form'
import { createMemo, Show, For } from 'solid-js'
import { CheckCircle2, XCircle } from 'lucide-solid'
import { createPasswordChange, createPasswordValidation } from '../../composables'
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '../../utils/validation'
import { PasswordInput } from '../base/PasswordInput'
import { LoadingButton } from '../base'
import type { PasswordRequirements } from '../../../../shared/config'

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
 * Change password form with TanStack Form
 * Provides type-safe form handling with reactive validation
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
export function ChangePasswordForm(props: ChangePasswordFormProps) {
  const { changePassword, isLoading, success } = createPasswordChange({
    onSuccess: props.onSuccess,
    onError: props.onError,
  })

  const { validate, getRequirementsList } = createPasswordValidation(
    () => props.passwordRequirements
  )

  // Create TanStack Form instance
  const form = createForm(() => ({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      revokeOtherSessions: false,
    } as ChangePasswordFormData,
    onValidate: ({ value }: { value: ChangePasswordFormData }) => {
      const result = changePasswordSchema.safeParse(value)
      if (!result.success) {
        // Map Zod errors to TanStack Form field errors format
        const fieldErrors: Record<string, string[]> = {}
        for (const issue of result.error.issues) {
          const path = issue.path.join('.')
          if (!fieldErrors[path]) {
            fieldErrors[path] = []
          }
          fieldErrors[path].push(issue.message)
        }
        return fieldErrors
      }
      return undefined
    },
    onSubmit: async ({ value }) => {
      await changePassword(
        value.currentPassword,
        value.newPassword,
        value.revokeOtherSessions
      )

      // Clear form on success
      if (success()) {
        form.reset()
      }
    },
  }))

  // Get field states reactively
  const newPasswordValue = () => form.state.values.newPassword
  const confirmPasswordValue = () => form.state.values.confirmPassword

  // Reactive validation
  const validation = createMemo(() => {
    const password = newPasswordValue() || ''
    return props.passwordRequirements
      ? validate(password)
      : { valid: true, errors: [] }
  })

  const passwordsMatch = createMemo(
    () => newPasswordValue() === confirmPasswordValue()
  )

  const requirements = createMemo(() =>
    props.passwordRequirements ? getRequirementsList() : []
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      class="grid gap-4"
    >
      {/* Current Password Field */}
      <form.Field name="currentPassword">
        {(field) => (
          <div class="grid gap-2">
            <Label for="current-password">Current Password</Label>
            <PasswordInput
              id="current-password"
              name={field().name}
              value={field().state.value}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              onBlur={() => field().handleBlur()}
              placeholder="Enter current password"
              disabled={isLoading()}
            />
            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-xs text-red-600">
                {field().state.meta.errors[0]}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* New Password Field */}
      <form.Field name="newPassword">
        {(field) => (
          <div class="grid gap-2">
            <Label for="new-password">New Password</Label>
            <PasswordInput
              id="new-password"
              name={field().name}
              value={field().state.value}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              onBlur={() => field().handleBlur()}
              placeholder="Enter new password"
              disabled={isLoading()}
            />

            {/* Password Requirements */}
            <Show when={props.passwordRequirements && field().state.value}>
              <div class="text-xs space-y-1 mt-2">
                <p class="font-medium text-gray-700 dark:text-gray-300">
                  Password must contain:
                </p>
                <For each={requirements()}>
                  {(req) => {
                    const isValid = createMemo(
                      () =>
                        validation().valid ||
                        !validation().errors.some((err) =>
                          err
                            .toLowerCase()
                            .includes(
                              req.toLowerCase().split(' ').slice(-2).join(' ')
                            )
                        )
                    )
                    return (
                      <div class="flex items-center gap-2">
                        <Show
                          when={isValid()}
                          fallback={<XCircle size={14} class="text-red-600" />}
                        >
                          <CheckCircle2 size={14} class="text-green-600" />
                        </Show>
                        <span
                          classList={{
                            'text-green-700 dark:text-green-500': isValid(),
                            'text-red-700 dark:text-red-500': !isValid(),
                          }}
                        >
                          {req}
                        </span>
                      </div>
                    )
                  }}
                </For>
              </div>
            </Show>

            {/* Validation Errors */}
            <Show when={field().state.value && validation().errors.length > 0}>
              <div class="text-xs text-red-600 dark:text-red-500 space-y-1">
                <For each={validation().errors}>
                  {(error) => (
                    <div class="flex items-center gap-2">
                      <XCircle size={14} />
                      <span>{error}</span>
                    </div>
                  )}
                </For>
              </div>
            </Show>

            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-xs text-red-600">
                {field().state.meta.errors[0]}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* Confirm Password Field */}
      <form.Field name="confirmPassword">
        {(field) => (
          <div class="grid gap-2">
            <Label for="confirm-password">Confirm New Password</Label>
            <PasswordInput
              id="confirm-password"
              name={field().name}
              value={field().state.value}
              onInput={(e) => field().handleChange(e.currentTarget.value)}
              onBlur={() => field().handleBlur()}
              placeholder="Confirm new password"
              disabled={isLoading()}
            />

            {/* Password Match Indicator */}
            <Show when={field().state.value}>
              <div class="flex items-center gap-2 text-xs">
                <Show
                  when={passwordsMatch()}
                  fallback={
                    <>
                      <XCircle size={14} class="text-red-600" />
                      <span class="text-red-700 dark:text-red-500">
                        Passwords do not match
                      </span>
                    </>
                  }
                >
                  <CheckCircle2 size={14} class="text-green-600" />
                  <span class="text-green-700 dark:text-green-500">
                    Passwords match
                  </span>
                </Show>
              </div>
            </Show>

            <Show when={field().state.meta.errors.length > 0}>
              <p class="text-xs text-red-600">
                {field().state.meta.errors[0]}
              </p>
            </Show>
          </div>
        )}
      </form.Field>

      {/* Revoke Other Sessions Option */}
      <Show when={props.showRevokeSessionsOption}>
        <form.Field name="revokeOtherSessions">
          {(field) => (
            <div class="flex items-center space-x-2 pt-2">
              <Checkbox
                id="revoke-sessions"
                checked={field().state.value}
                onChange={(checked) => field().handleChange(checked)}
                disabled={isLoading()}
              />
              <Label
                for="revoke-sessions"
                class="text-sm font-normal cursor-pointer"
              >
                Sign out all other devices
              </Label>
            </div>
          )}
        </form.Field>
      </Show>

      {/* Submit Button */}
      <LoadingButton
        type="submit"
        class="w-full"
        isLoading={isLoading()}
        loadingText="Changing Password..."
      >
        Change Password
      </LoadingButton>
    </form>
  )
}

export default ChangePasswordForm