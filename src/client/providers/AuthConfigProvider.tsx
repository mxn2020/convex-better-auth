/**
 * Auth Configuration Provider
 * Provides configuration context to all auth hooks and components
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'
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
const AuthConfigContext = createContext<AuthConfigContextValue | null>(null)

/**
 * Props for AuthConfigProvider
 */
export interface AuthConfigProviderProps {
  /** Child components */
  children: ReactNode

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
export function AuthConfigProvider({
  children,
  config = {},
}: AuthConfigProviderProps) {
  // Merge user config with defaults
  const mergedConfig = useMemo(() => mergeAuthConfig(config), [config])

  // Create context value with helper functions
  const value = useMemo<AuthConfigContextValue>(() => {
    return {
      config: mergedConfig,

      isMethodEnabled: (method: AuthMethod) => {
        const enabledMethods =
          mergedConfig.features?.enabledAuthMethods ?? []
        return enabledMethods.includes(method)
      },

      getEnabledProviders: () => {
        const providers: ('github' | 'google')[] = []

        if (mergedConfig.socialProviders?.github?.enabled) {
          providers.push('github')
        }

        if (mergedConfig.socialProviders?.google?.enabled) {
          providers.push('google')
        }

        return providers
      },
    }
  }, [mergedConfig])

  return (
    <AuthConfigContext.Provider value={value}>
      {children}
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
