/**
 * Hook for dynamic authentication method selection in Solid
 * Provides method toggling and filtering based on configuration
 */

import { createSignal, createMemo } from 'solid-js'
import { useAuthConfig } from './useAuthConfig'
import type { AuthMethod } from '../../config/types'

/**
 * Auth method groups for UI toggling
 */
export type AuthMethodGroup = 'password' | 'passwordless'

/**
 * Hook for managing authentication method selection
 * Automatically filters methods based on config and provides toggling
 *
 * @example
 * ```tsx
 * function SignInForm() {
 *   const {
 *     selectedMethod,
 *     setMethod,
 *     availableMethods,
 *     hasPassword,
 *     hasPasswordless,
 *   } = useAuthMethod()
 *
 *   return (
 *     <div>
 *       <Show when={selectedMethod() === 'password'}>
 *         <PasswordFields />
 *       </Show>
 *       <Show when={selectedMethod() === 'passwordless'}>
 *         <PasswordlessOptions />
 *       </Show>
 *
 *       <Show when={hasPassword() && hasPasswordless()}>
 *         <button onClick={() => setMethod(
 *           selectedMethod() === 'password' ? 'passwordless' : 'password'
 *         )}>
 *           Toggle method
 *         </button>
 *       </Show>
 *     </div>
 *   )
 * }
 * ```
 */
export function useAuthMethod() {
  const { config, isMethodEnabled } = useAuthConfig()

  // Get default method from config
  const defaultMethod = config.features?.defaultSignInMethod || 'password'

  const [selectedMethod, setSelectedMethod] =
    createSignal<AuthMethodGroup>(defaultMethod)

  // Get all available auth methods from config
  const availableMethods = createMemo(() => {
    const methods = config.features?.enabledAuthMethods || []
    return methods.filter((m) => isMethodEnabled(m))
  })

  // Determine if passwordless methods are available
  const hasPasswordless = createMemo(() => {
    return availableMethods().some((m) =>
      ['magic-link', 'otp', 'anonymous'].includes(m)
    )
  })

  // Determine if password method is available
  const hasPassword = createMemo(() => {
    return availableMethods().includes('password')
  })

  // Available method groups for toggling
  const availableGroups = createMemo(() => {
    const groups: AuthMethodGroup[] = []
    if (hasPassword()) groups.push('password')
    if (hasPasswordless()) groups.push('passwordless')
    return groups
  })

  // Get specific passwordless methods
  const passwordlessMethods = createMemo(() => {
    return availableMethods().filter((m) =>
      ['magic-link', 'otp', 'anonymous'].includes(m)
    )
  })

  // Get social providers
  const socialProviders = createMemo(() => {
    return availableMethods().filter((m) =>
      ['github', 'google'].includes(m)
    ) as ('github' | 'google')[]
  })

  /**
   * Set authentication method group
   * Only allows setting methods that are available
   */
  const setMethod = (method: AuthMethodGroup) => {
    if (availableGroups().includes(method)) {
      setSelectedMethod(method)
    }
  }

  /**
   * Toggle between password and passwordless
   */
  const toggleMethod = () => {
    if (availableGroups().length <= 1) return

    setSelectedMethod((current) =>
      current === 'password' ? 'passwordless' : 'password'
    )
  }

  return {
    /** Currently selected method group */
    selectedMethod,

    /** Set authentication method group */
    setMethod,

    /** Toggle between password and passwordless */
    toggleMethod,

    /** All available authentication methods */
    availableMethods,

    /** Available method groups (password, passwordless) */
    availableGroups,

    /** Whether password auth is available */
    hasPassword,

    /** Whether any passwordless method is available */
    hasPasswordless,

    /** Available passwordless methods (magic-link, otp, anonymous) */
    passwordlessMethods,

    /** Available social providers (github, google) */
    socialProviders,

    /** Whether method toggling is possible */
    canToggle: createMemo(() => availableGroups().length > 1),
  }
}
