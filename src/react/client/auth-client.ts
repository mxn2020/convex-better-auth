// src/react/client/auth-client.ts

/**
 * Better Auth client for React applications
 * Includes all plugin clients for magic link, OTP, 2FA, anonymous, and Convex integration
 */

import {
  twoFactorClient,
  magicLinkClient,
  emailOTPClient,
  anonymousClient,
  usernameClient,
  apiKeyClient,
  jwtClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { convexClient } from '@convex-dev/better-auth/client/plugins'
import { adminClient } from "better-auth/client/plugins"
import { oauthProviderClient } from '@better-auth/oauth-provider/client'
import {
  ac,
  superadminRole,
  adminRole,
  editorRole,
  visitorRole,
  applicantRole,
  memberRole,
  staffRole,
} from "../../shared/permissions";


const getEnv = (key: string): string => {
  // Try to access environment variables safely
  // This function is called during module load, so we need to be safe for Convex backend analysis
  try {
    // Vite environment (browser/client)
    // Use type assertion because import.meta.env types may not be available in consuming apps
    const importMeta = import.meta as any;
    if (typeof import.meta !== 'undefined' && importMeta?.env?.[key]) {
      return importMeta.env[key];
    }
  } catch (e) {
    // import.meta not supported in this environment (e.g., Convex backend)
  }

  // Node.js environment
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }

  // Fallback - return empty string to avoid errors during Convex deployment analysis
  // The actual value will be available when running in the browser
  return '';
}

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
  baseURL: getEnv('VITE_CONVEX_SITE_URL'), // || 'https://tacit-mink-132.convex.site',
  plugins: [
    magicLinkClient(),
    emailOTPClient(),
    twoFactorClient(),
    anonymousClient(),
    convexClient(),
    adminClient({
      ac,  // Access controller
      roles: {
        superadmin: superadminRole,
        admin: adminRole,
        editor: editorRole,
        visitor: visitorRole,
        applicant: applicantRole,
        member: memberRole,
        staff: staffRole,
      },
      defaultRole: "visitor",
    }),
    usernameClient(),
    apiKeyClient(),
    oauthProviderClient(),
    jwtClient()
  ],
})

/**
 * Export type for the auth client
 */
import type { OAuth2Methods } from './types/oauth'

export type AuthClient = typeof authClient & {
  oauth2: OAuth2Methods
}
