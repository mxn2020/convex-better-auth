/**
 * Standardized form field component
 * Combines label, input, and error display
 */

import { forwardRef, type InputHTMLAttributes } from 'react'
import { Label, Input } from '@tanstack-app/ui'

export interface FormFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  /** Field label */
  label: string

  /** Error message to display */
  error?: string

  /** Helper text to display below input */
  helperText?: string
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
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, id, size: _size, ...props }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId}>{label}</Label>
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
