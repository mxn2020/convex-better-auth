/**
 * Client-side exports for Convex Better Auth package
 * Use these in your React application (src/ directory)
 */

// Auth client
export { authClient, type AuthClient } from './auth-client'

// UI Components
export { default as SignIn } from './components/SignIn'
export { default as SignUp } from './components/SignUp'
export { default as ResetPassword } from './components/ResetPassword'
export { default as EnableTwoFactor } from './components/EnableTwoFactor'
export { default as Settings } from './components/Settings'
export { ChangePassword } from './components/ChangePassword'
export { ResendVerification, ResendVerificationLink } from './components/ResendVerification'

// Component prop types
export type { ChangePasswordProps } from './components/ChangePassword'
export type { ResendVerificationProps } from './components/ResendVerification'
export type { SettingsPageProps } from './components/Settings'

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
