// src/react/client/auth-client.ts

/**
 * Better Auth client for SolidJS applications (TanStack Start)
 * Includes all plugin clients for magic link, OTP, 2FA, anonymous, and Convex integration
 */

import {
  twoFactorClient,
  magicLinkClient,
  emailOTPClient,
  anonymousClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/solid'
import { convexClient } from '@convex-dev/better-auth/client/plugins'

/**
 * Creates and exports the auth client with all plugins
 * This client can be used throughout your SolidJS application for authentication
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

export type AuthClient = typeof authClient
