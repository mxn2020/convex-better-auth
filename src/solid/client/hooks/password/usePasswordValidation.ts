/**
 * Hook for password validation in Solid
 * Provides password validation utilities based on configured requirements
 */

import { createMemo } from 'solid-js'
import {
  validatePassword,
  getPasswordRequirementsList,
  type PasswordRequirements,
} from '../../../../shared/config'
import { useAuthConfig } from '../utils/useAuthConfig'

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Hook for password validation
 * Uses configured password requirements from AuthConfigProvider
 *
 * @param customRequirements - Optional custom requirements (overrides config)
 *
 * @example
 * ```tsx
 * function PasswordField() {
 *   const { validate, getRequirementsList } = usePasswordValidation()
 *   const [password, setPassword] = createSignal('')
 *
 *   const validation = () => validate(password())
 *   const requirements = getRequirementsList()
 *
 *   return (
 *     <div>
 *       <input
 *         value={password()}
 *         onInput={(e) => setPassword(e.currentTarget.value)}
 *       />
 *       <Show when={!validation().valid}>
 *         <ul>
 *           <For each={validation().errors}>
 *             {(error) => <li>{error}</li>}
 *           </For>
 *         </ul>
 *       </Show>
 *       <p>Requirements:</p>
 *       <ul>
 *         <For each={requirements()}>
 *           {(req) => <li>{req}</li>}
 *         </For>
 *       </ul>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePasswordValidation(
  customRequirements?: PasswordRequirements
) {
  const { config } = useAuthConfig()

  // Use custom requirements or fallback to config
  const requirements = createMemo(() => {
    return customRequirements || config.password || {
      minLength: 8,
      maxLength: 128,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false,
    }
  })

  /**
   * Validate password against requirements
   */
  const validate = (password: string): PasswordValidationResult => {
    return validatePassword(password, requirements())
  }

  /**
   * Get list of password requirements as strings
   */
  const getRequirementsList = createMemo((): string[] => {
    return getPasswordRequirementsList(requirements())
  })

  /**
   * Check if password meets a specific requirement
   */
  const checkRequirement = (
    password: string,
    requirement: keyof PasswordRequirements
  ): boolean => {
    const reqs = requirements()

    if (requirement === 'minLength') {
      return password.length >= reqs.minLength
    }

    if (requirement === 'maxLength') {
      return password.length <= reqs.maxLength
    }

    if (requirement === 'requireUppercase') {
      return !reqs.requireUppercase || /[A-Z]/.test(password)
    }

    if (requirement === 'requireLowercase') {
      return !reqs.requireLowercase || /[a-z]/.test(password)
    }

    if (requirement === 'requireNumbers') {
      return !reqs.requireNumbers || /\d/.test(password)
    }

    if (requirement === 'requireSpecialChars') {
      return (
        !reqs.requireSpecialChars ||
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
      )
    }

    return false
  }

  return {
    /** Current password requirements */
    requirements,

    /** Validate password against requirements */
    validate,

    /** Get list of requirements as human-readable strings */
    getRequirementsList,

    /** Check if password meets a specific requirement */
    checkRequirement,
  }
}
