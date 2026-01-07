// src/solid/client/components/base/OTPInput.tsx

import type { Component, JSX } from 'solid-js'
import { Show } from 'solid-js'
import { Input, Label } from '@tanstack-app/ui/solid'

export interface OTPInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label?: string
  ref?: HTMLInputElement | ((el: HTMLInputElement) => void)
}

export const OTPInput: Component<OTPInputProps> = (props) => {
  return (
    <div class="space-y-2">
      <Show when={props.label}>
        <Label for={props.id}>{props.label}</Label>
      </Show>
      <Input
        id={props.id}
        ref={props.ref}
        type="text"
        placeholder={props.placeholder || 'Enter verification code'}
        pattern="[0-9]*"
        inputMode="numeric"
        maxLength={props.maxLength || 6}
        {...props}
      />
    </div>
  )
}
