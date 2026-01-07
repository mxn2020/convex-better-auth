// packages/convex-better-auth/src/solid/client/components/base/FormField.tsx

/**
 * Standardized form field component for Solid
 * Combines label, input, and error display
 */

import type { Component, JSX } from 'solid-js'
import { Show } from 'solid-js'
import { Label, Input } from '@tanstack-app/ui/solid'

export interface FormFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  /** Field label */
  label: string

  /** Error message to display */
  error?: string

  /** Helper text to display below input */
  helperText?: string

  /** Additional component to render next to the label (e.g., button) */
  labelAction?: JSX.Element

  /** Input ref */
  ref?: HTMLInputElement | ((el: HTMLInputElement) => void)
}

/**
 * Form field with label and error display
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Email"
 *   type="email"
 *   value={email()}
 *   onInput={(e) => setEmail(e.currentTarget.value)}
 *   error={error()}
 * />
 * ```
 *
 * @example With label action
 * ```tsx
 * <FormField
 *   label="Password"
 *   type="password"
 *   labelAction={<Button variant="link">Forgot password?</Button>}
 *   value={password()}
 *   onInput={(e) => setPassword(e.currentTarget.value)}
 * />
 * ```
 */
export const FormField: Component<FormFieldProps> = (props) => {
  const fieldId = () => props.id || props.label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div class="space-y-2">
      <Show
        when={props.labelAction}
        fallback={<Label for={fieldId()}>{props.label}</Label>}
      >
        <div class="flex items-center justify-between">
          <Label for={fieldId()}>{props.label}</Label>
          {props.labelAction}
        </div>
      </Show>
      <Input
        id={fieldId()}
        ref={props.ref}
        aria-invalid={!!props.error}
        {...props}
      />
      <Show when={props.error}>
        <p class="text-xs text-red-600" role="alert">
          {props.error}
        </p>
      </Show>
      <Show when={props.helperText && !props.error}>
        <p class="text-xs text-gray-500">{props.helperText}</p>
      </Show>
    </div>
  )
}
