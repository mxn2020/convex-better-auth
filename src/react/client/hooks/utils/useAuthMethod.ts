/**
 * Hook for dynamic authentication method selection
 * Provides method toggling and filtering based on configuration
 */

import { useState, useCallback, useMemo } from 'react'
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
 *       {selectedMethod === 'password' && <PasswordFields />}
 *       {selectedMethod === 'passwordless' && <PasswordlessOptions />}
 *
 *       {hasPassword && hasPasswordless && (
 *         <button onClick={() => setMethod(
 *           selectedMethod === 'password' ? 'passwordless' : 'password'
 *         )}>
 *           Toggle method
 *         </button>
 *       )}
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
    useState<AuthMethodGroup>(defaultMethod)

  // Get all available auth methods from config
  const availableMethods = useMemo(() => {
    const methods = config.features?.enabledAuthMethods || []
    return methods.filter((m) => isMethodEnabled(m))
  }, [config.features?.enabledAuthMethods, isMethodEnabled])

  // Determine if passwordless methods are available
  const hasPasswordless = useMemo(() => {
    return availableMethods.some((m) =>
      ['magic-link', 'otp', 'anonymous'].includes(m)
    )
  }, [availableMethods])

  // Determine if password method is available
  const hasPassword = useMemo(() => {
    return availableMethods.includes('password')
  }, [availableMethods])

  // Available method groups for toggling
  const availableGroups = useMemo(() => {
    const groups: AuthMethodGroup[] = []
    if (hasPassword) groups.push('password')
    if (hasPasswordless) groups.push('passwordless')
    return groups
  }, [hasPassword, hasPasswordless])

  // Get specific passwordless methods
  const passwordlessMethods = useMemo(() => {
    return availableMethods.filter((m) =>
      ['magic-link', 'otp', 'anonymous'].includes(m)
    )
  }, [availableMethods])

  // Get social providers
  const socialProviders = useMemo(() => {
    return availableMethods.filter((m) =>
      ['github', 'google'].includes(m)
    ) as ('github' | 'google')[]
  }, [availableMethods])

  /**
   * Set authentication method group
   * Only allows setting methods that are available
   */
  const setMethod = useCallback(
    (method: AuthMethodGroup) => {
      if (availableGroups.includes(method)) {
        setSelectedMethod(method)
      }
    },
    [availableGroups]
  )

  /**
   * Toggle between password and passwordless
   */
  const toggleMethod = useCallback(() => {
    if (availableGroups.length <= 1) return

    setSelectedMethod((current) =>
      current === 'password' ? 'passwordless' : 'password'
    )
  }, [availableGroups])

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
    canToggle: availableGroups.length > 1,
  }
}
