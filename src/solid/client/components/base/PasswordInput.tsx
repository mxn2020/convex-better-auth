// src/solid/client/components/base/PasswordInput.tsx

import type { Component, JSX } from 'solid-js'
import { createSignal } from 'solid-js'
import { Input } from '@tanstack-app/ui/solid'
import { Label } from '@tanstack-app/ui/solid'
import Eye from 'lucide-solid/icons/eye'
import EyeOff from 'lucide-solid/icons/eye-off'

export interface PasswordInputProps {
  id: string
  label?: string
  value?: string
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>
  onBlur?: JSX.EventHandler<HTMLInputElement, FocusEvent>
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  class?: string
  name?: string
}

export const PasswordInput: Component<PasswordInputProps> = (props) => {
  const [showPassword, setShowPassword] = createSignal(false)

  return (
    <div class="space-y-2">
      {props.label && <Label for={props.id}>{props.label}</Label>}
      <div class="relative">
        <Input
          id={props.id}
          name={props.name}
          type={showPassword() ? 'text' : 'password'}
          value={props.value}
          oninput={props.onInput}
          onblur={props.onBlur}
          placeholder={props.placeholder}
          required={props.required}
          disabled={props.disabled}
          autocomplete={props.autoComplete}
          class={props.class}
        />
        <button
          type="button"
          onclick={() => setShowPassword(prev => !prev)}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabindex="-1"
        >
          {showPassword() ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

