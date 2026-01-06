/**
 * Server-side exports for Convex Better Auth package
 * Use these in your Convex backend (convex/ directory)
 */

// Auth component and factory functions
export {
  createAuthComponent,
  createAuthOptions,
  createAuth,
  type AuthComponentAPI,
} from './auth'

// Query utilities
export { createAuthQueries, type AuthQueries } from './queries'

// Email utilities
export {
  createResendClient,
  sendEmailVerification,
  sendOTPVerification,
  sendMagicLink,
  sendResetPassword,
  createEmailUtilities,
} from './email'

// Email templates
export * from './emails'

// Server-side types (if needed)
export type { ConvexBetterAuthConfig } from '../shared/config'
