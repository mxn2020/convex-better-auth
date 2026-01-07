/**
 * Toggle between password and passwordless authentication methods
 * Only shown when both methods are available
 */

import { Button } from '@tanstack-app/ui'
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
 *   current={selectedMethod}
 *   onChange={setMethod}
 *   available={availableGroups}
 * />
 * ```
 */
export function MethodToggle({
  current,
  onChange,
  available,
  passwordText = 'Sign in with magic link or OTP instead',
  passwordlessText = 'Sign in with a password instead',
}: MethodToggleProps) {
  // Don't render if only one method is available
  if (available.length <= 1) {
    return null
  }

  const toggleText =
    current === 'password' ? passwordText : passwordlessText

  const handleToggle = () => {
    onChange(current === 'password' ? 'passwordless' : 'password')
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="text-sm w-full"
      onClick={handleToggle}
    >
      {toggleText}
    </Button>
  )
}
