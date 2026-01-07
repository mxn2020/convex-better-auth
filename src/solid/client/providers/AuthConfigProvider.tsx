// src/solid/client/providers/AuthConfigProvider.tsx

/**
 * Auth Configuration Provider
 * Provides configuration context to all auth composables and components
 */

import {
  createContext,
  useContext,
  createMemo,
  type ParentComponent,
  type Accessor,
} from 'solid-js'
import type { AuthClientConfig, AuthMethod } from '../config/types'
import { mergeAuthConfig } from '../config/merge'

/**
 * Context value provided to consumers
 */
export interface AuthConfigContextValue {
  /** Complete merged configuration */
  config: Accessor<AuthClientConfig>

  /** Check if a specific auth method is enabled */
  isMethodEnabled: (method: AuthMethod) => boolean

  /** Get list of enabled social providers */
  getEnabledProviders: () => ('github' | 'google')[]
}

/**
 * Auth configuration context
 */
const AuthConfigContext = createContext<AuthConfigContextValue>()

/**
 * Props for AuthConfigProvider
 */
export interface AuthConfigProviderProps {
  /** User configuration (optional) - will be merged with defaults */
  config?: Partial<AuthClientConfig>
}

/**
 * AuthConfigProvider component
 * Wrap your app with this provider to enable configuration-driven auth
 *
 * @example
 * ```tsx
 * <AuthConfigProvider config={{
 *   features: {
 *     enabledAuthMethods: ['password', 'github'],
 *     defaultSignInMethod: 'password',
 *   },
 *   navigation: {
 *     afterSignIn: '/dashboard',
 *   },
 * }}>
 *   <App />
 * </AuthConfigProvider>
 * ```
 */
export const AuthConfigProvider: ParentComponent<AuthConfigProviderProps> = (
  props
) => {
  // Merge user config with defaults - reactive to prop changes
  const mergedConfig = createMemo(() => mergeAuthConfig(props.config || {}))

  // Create context value with helper functions
  const value: AuthConfigContextValue = {
    config: mergedConfig,

    isMethodEnabled: (method: AuthMethod) => {
      const enabledMethods = mergedConfig().features?.enabledAuthMethods ?? []
      return enabledMethods.includes(method)
    },

    getEnabledProviders: () => {
      const config = mergedConfig()
      const providers: ('github' | 'google')[] = []

      if (config.socialProviders?.github?.enabled) {
        providers.push('github')
      }

      if (config.socialProviders?.google?.enabled) {
        providers.push('google')
      }

      return providers
    },
  }

  return (
    <AuthConfigContext.Provider value={value}>
      {props.children}
    </AuthConfigContext.Provider>
  )
}

/**
 * Composable to access auth configuration
 * Must be used within AuthConfigProvider
 *
 * @throws Error if used outside AuthConfigProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { config, isMethodEnabled } = createAuthConfig()
 *
 *   return (
 *     <Show when={isMethodEnabled('github')}>
 *       <GitHubButton />
 *     </Show>
 *   )
 * }
 * ```
 */
export function createAuthConfig(): AuthConfigContextValue {
  const context = useContext(AuthConfigContext)  // ← Changed from createContext to useContext

  if (!context) {
    throw new Error(
      'createAuthConfig must be used within AuthConfigProvider. ' +
        'Please wrap your app with <AuthConfigProvider>.'
    )
  }

  return context
}
