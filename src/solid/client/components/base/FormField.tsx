// src/solid/client/components/base/FormField.tsx

import type { Component, JSX } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import { Label, Input } from '@tanstack-app/ui/solid'
import type { InputSize } from '@tanstack-app/ui/solid'

export interface FormFieldProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'size' | 'ref'> {
  label: string
  error?: string
  helperText?: string
  labelAction?: JSX.Element
  size?: InputSize
  // Only allow function refs, matching InputProps
  ref?: (el: HTMLInputElement) => void
}

export const FormField: Component<FormFieldProps> = (props) => {
  const [local, inputProps] = splitProps(props, [
    'label',
    'error',
    'helperText',
    'labelAction',
    'id',
    'class',
    'size',
    'ref',
  ])

  const fieldId =
    local.id ?? local.label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div class="space-y-2">
      <Show
        when={local.labelAction}
        fallback={<Label for={fieldId}>{local.label}</Label>}
      >
        <div class="flex items-center justify-between">
          <Label for={fieldId}>{local.label}</Label>
          {local.labelAction}
        </div>
      </Show>

      <Input
        id={fieldId}
        size={local.size}
        ref={local.ref}
        aria-invalid={!!local.error}
        {...inputProps}    // no conflicting ref/size here
      />

      <Show when={local.error}>
        <p class="text-xs text-red-600" role="alert">
          {local.error}
        </p>
      </Show>

      <Show when={local.helperText && !local.error}>
        <p class="text-xs text-gray-500">{local.helperText}</p>
      </Show>
    </div>
  )
}

