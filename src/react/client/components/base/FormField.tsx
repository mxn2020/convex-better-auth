// packages/convex-better-auth/src/client/components/base/FormField.tsx

/**
 * Standardized form field component
 * Combines label, input, and error display
 */

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { Label, Input } from '@tanstack-app/ui'

export interface FormFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  /** Field label */
  label: string

  /** Error message to display */
  error?: string

  /** Helper text to display below input */
  helperText?: string

  /** Additional component to render next to the label (e.g., button) */
  labelAction?: ReactNode
}

/**
 * Form field with label and error display
 * Integrates with react-hook-form via ref forwarding
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Email"
 *   error={errors.email?.message}
 *   {...register('email')}
 * />
 * ```
 *
 * @example With label action
 * ```tsx
 * <FormField
 *   label="Password"
 *   labelAction={<Button variant="link">Forgot password?</Button>}
 *   {...register('password')}
 * />
 * ```
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, labelAction, id, size: _size, ...props }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-2">
        {labelAction ? (
          <div className="flex items-center justify-between">
            <Label htmlFor={fieldId}>{label}</Label>
            {labelAction}
          </div>
        ) : (
          <Label htmlFor={fieldId}>{label}</Label>
        )}
        <Input id={fieldId} ref={ref} aria-invalid={!!error} {...props} />
        {error && (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'