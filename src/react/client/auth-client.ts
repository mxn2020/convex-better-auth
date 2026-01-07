/**
 * Better Auth client for React applications
 * Includes all plugin clients for magic link, OTP, 2FA, anonymous, and Convex integration
 */

import {
  twoFactorClient,
  magicLinkClient,
  emailOTPClient,
  anonymousClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { convexClient } from '@convex-dev/better-auth/client/plugins'

/**
 * Creates and exports the auth client with all plugins
 * This client can be used throughout your React application for authentication
 *
 * Usage:
 * ```ts
 * import { authClient } from '@convex-better-auth/client'
 *
 * // Sign in
 * await authClient.signIn.email({ email, password })
 *
 * // Sign up
 * await authClient.signUp.email({ email, password, name })
 *
 * // Get session
 * const { data: session } = authClient.useSession()
 * ```
 */
export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    emailOTPClient(),
    twoFactorClient(),
    anonymousClient(),
    convexClient(),
  ],
})

/**
 * Export type for the auth client
 */
export type AuthClient = typeof authClient
