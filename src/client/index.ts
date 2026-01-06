// packages/convex-better-auth/src/client/index.ts

/**
 * Client-side exports for Convex Better Auth package
 * Use these in your React application (src/ directory)
 */

// Auth client
export { authClient, type AuthClient } from './auth-client'

// Base components (reusable primitives)
export * from './components/base'

// Form components (complete auth flows)
export * from './components/forms'

// Utility components
export { UserProfile, type UserProfileProps } from './components/UserProfile'
export { SignOutButton, type SignOutButtonProps } from './components/SignOutButton'

// Re-export shared types for convenience
export type {
  PasswordRequirements,
  EmailVerificationConfig,
  ConvexBetterAuthConfig,
} from '../shared/config'

export type {
  AuthProvider,
  AuthStatus,
  EmailVerificationStatus,
  TwoFactorStatus,
  PasswordStrength,
} from '../shared/types'
