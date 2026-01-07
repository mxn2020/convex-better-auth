/**
 * Configuration types for the auth client
 * Enables feature flags, navigation control, and UI customization
 */

import type { PasswordRequirements } from '../../../shared/config'

/**
 * Available authentication methods
 */
export type AuthMethod =
  | 'password'
  | 'magic-link'
  | 'otp'
  | 'anonymous'
  | 'github'
  | 'google'

/**
 * Authentication flow types
 */
export type AuthFlow = 'sign-in' | 'sign-up' | 'reset-password'

/**
 * Feature flags for runtime control of auth methods and UI elements
 */
export interface FeatureFlags {
  /** A/B test variant (optional) */
  abTestVariant?: 'A' | 'B'

  /** Show/hide specific UI elements */
  showAccountDeletion?: boolean
  showEmailVerification?: boolean
  showTwoFactor?: boolean
  showProfileImage?: boolean

  /** Auth method availability - controls which methods are enabled */
  enabledAuthMethods?: AuthMethod[]

  /** Default auth method displayed on sign-in */
  defaultSignInMethod?: 'password' | 'passwordless'

  /** Require email verification before allowing sign-in */
  requireEmailVerification?: boolean

  /** Allow users to skip email verification */
  allowSkipVerification?: boolean
}

/**
 * Navigation configuration
 * Controls where users are redirected after auth actions
 */
export interface NavigationConfig {
  /** Where to redirect after successful sign-in */
  afterSignIn?: string

  /** Where to redirect after sign-up */
  afterSignUp?: string

  /** Where to redirect after sign-out */
  afterSignOut?: string

  /** Password reset page URL */
  passwordResetUrl?: string

  /** Email verification page URL */
  emailVerificationUrl?: string

  /** Two-factor verification page URL */
  twoFactorUrl?: string
}

/**
 * UI/UX configuration
 */
export interface UIConfig {
  /** Show social buttons above or below email/password */
  socialButtonsPosition?: 'top' | 'bottom'

  /** Custom branding */
  branding?: {
    name: string
    logoUrl?: string
    primaryColor?: string
  }

  /** Show "Powered by better-auth" footer */
  showBetterAuthBranding?: boolean

  /** Custom error messages - override default messages by error key */
  errorMessages?: Record<string, string>

  /** Custom success messages */
  successMessages?: Record<string, string>
}

/**
 * Social provider configuration
 */
export interface SocialProviderConfig {
  enabled: boolean
  clientId?: string
}

/**
 * Social providers configuration
 */
export interface SocialProvidersConfig {
  github?: SocialProviderConfig
  google?: SocialProviderConfig
}

/**
 * Main auth client configuration
 * This is the top-level config passed to AuthConfigProvider
 */
export interface AuthClientConfig {
  /** Feature flags for runtime control */
  features?: FeatureFlags

  /** Navigation configuration */
  navigation?: NavigationConfig

  /** UI/UX configuration */
  ui?: UIConfig

  /** Password requirements (from shared config) */
  password?: PasswordRequirements

  /** OAuth providers configuration */
  socialProviders?: SocialProvidersConfig

  /** Global error handler - called for all auth errors */
  onError?: (error: Error, context: string) => void

  /** Global success handler - called for all auth successes */
  onSuccess?: (event: string, data?: any) => void
}
