// src/solid/client/components/base/OTPInput.tsx

import type { Component, JSX } from 'solid-js'
import { Show } from 'solid-js'
import { Input } from '@tanstack-app/ui/solid'
import { Label } from '@tanstack-app/ui/solid'

export interface OTPInputProps {
  id: string
  label?: string
  value: string
  onChange: JSX.EventHandler<HTMLInputElement, InputEvent>
  placeholder?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  class?: string
}

export const OTPInput: Component<OTPInputProps> = (props) => {
  return (
    <div class="space-y-2">
      <Show when={props.label}>
        <Label for={props.id}>{props.label}</Label>
      </Show>
      <Input
        id={props.id}
        type="text"
        value={props.value}
        oninput={props.onChange}
        placeholder={props.placeholder ?? 'Enter verification code'}
        required={props.required}
        disabled={props.disabled}
        pattern="[0-9]*"
        inputmode="numeric"
        maxlength={props.maxLength ?? 6}
        class={props.class}
      />
    </div>
  )
}
