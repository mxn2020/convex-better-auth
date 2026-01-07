/**
 * Auth Configuration Provider for Solid
 * Provides configuration context to all auth hooks and components
 */

import { createContext, useContext, createMemo, type JSX, type Component } from 'solid-js'
import type { AuthClientConfig, AuthMethod } from '../config/types'
import { mergeAuthConfig } from '../config/merge'

/**
 * Context value provided to consumers
 */
export interface AuthConfigContextValue {
  /** Complete merged configuration */
  config: AuthClientConfig

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
  /** Child components */
  children: JSX.Element

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
export const AuthConfigProvider: Component<AuthConfigProviderProps> = (props) => {
  // Merge user config with defaults
  const mergedConfig = createMemo(() => mergeAuthConfig(props.config || {}))

  // Create context value with helper functions
  const value = createMemo<AuthConfigContextValue>(() => {
    const config = mergedConfig()

    return {
      config,

      isMethodEnabled: (method: AuthMethod) => {
        const enabledMethods = config.features?.enabledAuthMethods ?? []
        return enabledMethods.includes(method)
      },

      getEnabledProviders: () => {
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
  })

  return (
    <AuthConfigContext.Provider value={value()}>
      {props.children}
    </AuthConfigContext.Provider>
  )
}

/**
 * Hook to access auth configuration
 * Must be used within AuthConfigProvider
 *
 * @throws Error if used outside AuthConfigProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { config, isMethodEnabled } = useAuthConfig()
 *
 *   if (isMethodEnabled('github')) {
 *     return <GitHubButton />
 *   }
 * }
 * ```
 */
export function useAuthConfig(): AuthConfigContextValue {
  const context = useContext(AuthConfigContext)

  if (!context) {
    throw new Error(
      'useAuthConfig must be used within AuthConfigProvider. ' +
        'Please wrap your app with <AuthConfigProvider>.'
    )
  }

  return context
}
