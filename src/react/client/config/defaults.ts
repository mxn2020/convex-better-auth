/**
 * Default configuration values for the auth client
 * These provide sensible defaults that can be overridden by user config
 */

import type { AuthClientConfig } from './types'

/**
 * Default auth client configuration
 * All auth methods enabled by default, with optional customization
 */
export const defaultAuthConfig: AuthClientConfig = {
  features: {
    // All auth methods enabled by default
    enabledAuthMethods: [
      'password',
      'magic-link',
      'otp',
      'anonymous',
      'github',
      'google',
    ],

    // Default to password-based sign-in
    defaultSignInMethod: 'password',

    // UI feature flags - all enabled by default
    showAccountDeletion: true,
    showEmailVerification: true,
    showTwoFactor: true,
    showProfileImage: true,

    // Email verification settings
    requireEmailVerification: false,
    allowSkipVerification: true,
  },

  navigation: {
    // Default navigation paths
    afterSignIn: '/',
    afterSignUp: '/',
    afterSignOut: '/sign-in',
    passwordResetUrl: '/reset-password',
    emailVerificationUrl: '/verify-email',
    twoFactorUrl: '/verify-2fa',
  },

  ui: {
    // Social buttons below email/password by default
    socialButtonsPosition: 'bottom',

    // Default branding
    branding: {
      name: 'App',
    },

    // Show Better Auth branding by default
    showBetterAuthBranding: true,
  },

  password: {
    // Default password requirements (lenient)
    minLength: 8,
    maxLength: 128,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
  },

  socialProviders: {
    // Social providers enabled by default (if configured on backend)
    github: { enabled: true },
    google: { enabled: true },
  },
}
