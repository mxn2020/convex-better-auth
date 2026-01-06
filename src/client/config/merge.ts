/**
 * Configuration merging utilities
 * Handles deep merging of user config with defaults
 */

import type { AuthClientConfig } from './types'
import { defaultAuthConfig } from './defaults'

/**
 * Deep merge two objects
 * Later values override earlier ones
 */
function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]

    if (sourceValue === undefined) {
      continue
    }

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue)
    } else {
      result[key] = sourceValue as any
    }
  }

  return result
}

/**
 * Merges user configuration with default values
 * User config takes precedence over defaults
 *
 * @param userConfig - User-provided configuration (partial)
 * @returns Complete configuration with defaults filled in
 *
 * @example
 * ```ts
 * const config = mergeAuthConfig({
 *   features: {
 *     enabledAuthMethods: ['password', 'github'],
 *   },
 * })
 * // Result includes all defaults plus the user's custom values
 * ```
 */
export function mergeAuthConfig(
  userConfig: Partial<AuthClientConfig> = {}
): AuthClientConfig {
  return deepMerge(defaultAuthConfig, userConfig)
}
