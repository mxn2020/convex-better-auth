/**
 * Better Auth factory functions for Convex integration
 * Provides configurable auth component and options creation
 */

import { betterAuth, type BetterAuthOptions } from 'better-auth/minimal'
import {
  AuthFunctions,
  createClient,
  type GenericCtx,
} from '@convex-dev/better-auth'
import { anonymous, emailOTP, magicLink, twoFactor } from 'better-auth/plugins'
import { convex } from '@convex-dev/better-auth/plugins'
import { requireActionCtx } from '@convex-dev/better-auth/utils'
import type { ConvexBetterAuthConfig } from '../shared/config'
import {
  createResendClient,
  sendEmailVerification,
  sendMagicLink,
  sendOTPVerification,
  sendResetPassword,
} from './email'

/**
 * Creates the Better Auth component with Convex adapter
 * This should be called once at the module level in your convex/auth.ts file
 *
 * @param components - Convex components from _generated/api
 * @param internal - Internal API from _generated/api
 * @param authConfig - Auth config from auth.config
 * @param config - Your authentication configuration
 * @param betterAuthSchema - Better Auth schema
 * @returns Configured auth component
 */
export function createAuthComponent<DataModel>(
  components: any,
  internal: any,
  authConfig: any,
  config: ConvexBetterAuthConfig<any, any>,
  betterAuthSchema: any
) {
  const authFunctions: AuthFunctions = internal.auth

  return createClient<DataModel, typeof betterAuthSchema>(
    components.betterAuth,
    {
      authFunctions,
      local: {
        schema: betterAuthSchema,
      },
      verbose: false,
      triggers: {
        user: {
          onCreate: config.hooks?.onCreate,
          onUpdate: config.hooks?.onUpdate,
          onDelete: config.hooks?.onDelete,
        },
      },
    }
  )
}

/**
 * Creates Better Auth options with all plugins configured
 *
 * @param ctx - Convex context
 * @param authComponent - The auth component created by createAuthComponent
 * @param config - Your authentication configuration
 * @param authConfig - Auth config from auth.config
 * @param components - Convex components from _generated/api
 * @returns Better Auth options
 */
export function createAuthOptions<DataModel>(
  ctx: GenericCtx<DataModel>,
  authComponent: any,
  config: ConvexBetterAuthConfig,
  authConfig: any,
  components: any
): BetterAuthOptions {
  // Create Resend client for email sending
  const resend = createResendClient(components)

  return {
    baseURL: config.site.url,
    database: authComponent.adapter(ctx),
    account: {
      accountLinking: {
        enabled: true,
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmailVerification(requireActionCtx(ctx), resend, config, {
          to: user.email,
          url,
        })
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: config.emailVerification.required,
      minPasswordLength: config.password.minLength,
      maxPasswordLength: config.password.maxLength,
      sendResetPassword: async ({ user, url }) => {
        await sendResetPassword(requireActionCtx(ctx), resend, config, {
          to: user.email,
          url,
        })
      },
    },
    socialProviders: config.socialProviders
      ? {
          github: config.socialProviders.github,
          google: config.socialProviders.google,
        }
      : undefined,
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await sendMagicLink(requireActionCtx(ctx), resend, config, {
            to: email,
            url,
          })
        },
      }),
      emailOTP({
        async sendVerificationOTP({ email, otp }) {
          await sendOTPVerification(requireActionCtx(ctx), resend, config, {
            to: email,
            code: otp,
          })
        },
      }),
      twoFactor(),
      anonymous(),
      convex({
        authConfig,
      }),
    ],
  } satisfies BetterAuthOptions
}

/**
 * Creates a Better Auth instance
 * Call this function when you need to interact with the auth API
 *
 * @param ctx - Convex context
 * @param authComponent - The auth component
 * @param config - Your authentication configuration
 * @param authConfig - Auth config from auth.config
 * @param components - Convex components
 * @returns Better Auth instance
 */
export function createAuth<DataModel>(
  ctx: GenericCtx<DataModel>,
  authComponent: any,
  config: ConvexBetterAuthConfig,
  authConfig: any,
  components: any
) {
  return betterAuth(
    createAuthOptions(ctx, authComponent, config, authConfig, components)
  )
}

/**
 * Type definitions for exported auth component methods
 */
export interface AuthComponentAPI {
  onCreate: any
  onUpdate: any
  onDelete: any
  getAuthUser: any
  safeGetAuthUser: any
  setUserId: any
  triggersApi: () => {
    onCreate: any
    onUpdate: any
    onDelete: any
  }
  clientApi: () => {
    getAuthUser: any
  }
  getAuth: (createAuth: any, ctx: any) => Promise<any>
  adapter: (ctx: any) => any
}
