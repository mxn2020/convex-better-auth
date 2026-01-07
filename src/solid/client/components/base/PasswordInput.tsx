// src/solid/client/components/base/PasswordInput.tsx

import type { Component, JSX } from 'solid-js'
import { Show, createSignal } from 'solid-js'
import { Input, Label } from '@tanstack-app/ui/solid'
import { Eye, EyeOff } from 'lucide-solid'

export interface PasswordInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label?: string
  ref?: HTMLInputElement | ((el: HTMLInputElement) => void)
}

export const PasswordInput: Component<PasswordInputProps> = (props) => {
  const [showPassword, setShowPassword] = createSignal(false)

  return (
    <div class="space-y-2">
      <Show when={props.label}>
        <Label for={props.id}>{props.label}</Label>
      </Show>
      <div class="relative">
        <Input
          id={props.id}
          ref={props.ref}
          type={showPassword() ? 'text' : 'password'}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword())}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          <Show when={showPassword()} fallback={<Eye size={16} />}>
            <EyeOff size={16} />
          </Show>
        </button>
      </div>
    </div>
  )
}
