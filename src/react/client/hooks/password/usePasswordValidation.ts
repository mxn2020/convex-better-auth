/**
 * Hook for password validation
 * Provides password validation utilities based on configured requirements
 */

import { useCallback, useMemo } from 'react'
import {
  validatePassword,
  getPasswordRequirementsList,
  type PasswordRequirements,
} from '../../../shared/config'
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
 *   const [password, setPassword] = useState('')
 *
 *   const validation = validate(password)
 *   const requirements = getRequirementsList()
 *
 *   return (
 *     <div>
 *       <input
 *         value={password}
 *         onChange={e => setPassword(e.target.value)}
 *       />
 *       {!validation.valid && (
 *         <ul>
 *           {validation.errors.map(error => (
 *             <li key={error}>{error}</li>
 *           ))}
 *         </ul>
 *       )}
 *       <p>Requirements:</p>
 *       <ul>
 *         {requirements.map(req => (
 *           <li key={req}>{req}</li>
 *         ))}
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
  const requirements = useMemo(() => {
    return customRequirements || config.password || {
      minLength: 8,
      maxLength: 128,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false,
    }
  }, [customRequirements, config.password])

  /**
   * Validate password against requirements
   */
  const validate = useCallback(
    (password: string): PasswordValidationResult => {
      return validatePassword(password, requirements)
    },
    [requirements]
  )

  /**
   * Get list of password requirements as strings
   */
  const getRequirementsList = useCallback((): string[] => {
    return getPasswordRequirementsList(requirements)
  }, [requirements])

  /**
   * Check if password meets a specific requirement
   */
  const checkRequirement = useCallback(
    (password: string, requirement: keyof PasswordRequirements): boolean => {
      if (requirement === 'minLength') {
        return password.length >= requirements.minLength
      }

      if (requirement === 'maxLength') {
        return password.length <= requirements.maxLength
      }

      if (requirement === 'requireUppercase') {
        return !requirements.requireUppercase || /[A-Z]/.test(password)
      }

      if (requirement === 'requireLowercase') {
        return !requirements.requireLowercase || /[a-z]/.test(password)
      }

      if (requirement === 'requireNumbers') {
        return !requirements.requireNumbers || /\d/.test(password)
      }

      if (requirement === 'requireSpecialChars') {
        return (
          !requirements.requireSpecialChars ||
          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        )
      }

      return false
    },
    [requirements]
  )

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
