// src/solid/client/components/base/MethodToggle.tsx

import type { Component } from 'solid-js'
import { splitProps } from 'solid-js'
import { Button } from '@tanstack-app/ui/solid'
import type { AuthMethodGroup } from '../../composables/utils/createAuthMethod'

export interface MethodToggleProps {
  /** Currently selected method */
  current: AuthMethodGroup

  /** Callback when method is changed */
  onChange: (method: AuthMethodGroup) => void

  /** Available methods (if only one, component won't render) */
  available: AuthMethodGroup[]

  /** Custom text for toggle button (optional) */
  passwordText?: string
  passwordlessText?: string
}

export const MethodToggle: Component<MethodToggleProps> = (allProps) => {
  const [local, buttonProps] = splitProps(allProps, [
    'current',
    'onChange',
    'available',
    'passwordText',
    'passwordlessText',
  ])

  // Don't render if only one method is available
  if (local.available.length <= 1) {
    return null
  }

  const toggleText = () =>
    local.current === 'password'
      ? local.passwordText ?? 'Sign in with magic link or OTP instead'
      : local.passwordlessText ?? 'Sign in with a password instead'

  const handleToggle = () => {
    local.onChange(
      local.current === 'password' ? 'passwordless' : 'password'
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      class="text-sm w-full"
      onclick={handleToggle}
      {...buttonProps} // only safe Button props
    >
      {toggleText()}
    </Button>
  )
}
