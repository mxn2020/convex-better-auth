/**
 * Toggle between password and passwordless authentication methods for Solid
 * Only shown when both methods are available
 */

import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import { Button } from '@tanstack-app/ui/solid'
import type { AuthMethodGroup } from '../../hooks/utils/useAuthMethod'

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

/**
 * Toggle button for switching between auth methods
 * Automatically hides if only one method is available
 *
 * @example
 * ```tsx
 * const { selectedMethod, setMethod, availableGroups } = useAuthMethod()
 *
 * <MethodToggle
 *   current={selectedMethod()}
 *   onChange={setMethod}
 *   available={availableGroups()}
 * />
 * ```
 */
export const MethodToggle: Component<MethodToggleProps> = (props) => {
  const toggleText = () =>
    props.current === 'password'
      ? props.passwordText || 'Sign in with magic link or OTP instead'
      : props.passwordlessText || 'Sign in with a password instead'

  const handleToggle = () => {
    props.onChange(props.current === 'password' ? 'passwordless' : 'password')
  }

  return (
    <Show when={props.available.length > 1}>
      <Button
        type="button"
        variant="ghost"
        class="text-sm w-full"
        onClick={handleToggle}
      >
        {toggleText()}
      </Button>
    </Show>
  )
}
