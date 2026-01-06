/**
 * Reusable query functions for authentication
 * These can be used directly or customized in your Convex backend
 */

import { ConvexError } from 'convex/values'
import { withoutSystemFields } from 'convex-helpers'

/**
 * Creates auth query functions bound to your auth component
 *
 * @param authComponent - The auth component from createAuthComponent
 * @returns Object with reusable query functions
 */
export function createAuthQueries(authComponent: any) {
  return {
    /**
     * Safely gets the current user (returns undefined if not authenticated)
     * Merges auth user data with your custom user table data
     *
     * @param ctx - Query context
     * @returns User object or undefined
     */
    safeGetUser: async (ctx: any) => {
      const authUser = await authComponent.safeGetAuthUser(ctx)
      if (!authUser) {
        return
      }
      const user = await ctx.db.get(authUser.userId)
      if (!user) {
        return
      }
      return { ...user, ...withoutSystemFields(authUser) }
    },

    /**
     * Gets the current user (throws error if not authenticated)
     * Merges auth user data with your custom user table data
     *
     * @param ctx - Query context
     * @returns User object
     * @throws ConvexError if user is not authenticated
     */
    getUser: async (ctx: any) => {
      const authUser = await authComponent.safeGetAuthUser(ctx)
      if (!authUser) {
        throw new ConvexError('Unauthenticated')
      }
      const user = await ctx.db.get(authUser.userId)
      if (!user) {
        throw new ConvexError('User not found')
      }
      return { ...user, ...withoutSystemFields(authUser) }
    },

    /**
     * Checks if the current user has a password (credential account)
     * Useful for determining if user can change password or needs to set one
     *
     * @param ctx - Query context
     * @param createAuth - Auth creation function
     * @returns True if user has a password account
     */
    hasPassword: async (ctx: any, createAuth: any) => {
      const { auth, headers } = await authComponent.getAuth(createAuth, ctx)
      const accounts = await auth.api.listUserAccounts({
        headers,
      })
      return accounts.some((account: any) => account.providerId === 'credential')
    },

    /**
     * Gets just the auth user data (from Better Auth's user table)
     * without merging with custom user table
     *
     * @param ctx - Query context
     * @returns Auth user object or undefined
     */
    safeGetAuthUser: async (ctx: any) => {
      return await authComponent.safeGetAuthUser(ctx)
    },

    /**
     * Gets just the auth user data (from Better Auth's user table)
     * Throws if not authenticated
     *
     * @param ctx - Query context
     * @returns Auth user object
     * @throws ConvexError if user is not authenticated
     */
    getAuthUser: async (ctx: any) => {
      const authUser = await authComponent.safeGetAuthUser(ctx)
      if (!authUser) {
        throw new ConvexError('Unauthenticated')
      }
      return authUser
    },

    /**
     * Gets all linked accounts for the current user
     * Shows which social providers are connected
     *
     * @param ctx - Query context
     * @param createAuth - Auth creation function
     * @returns Array of linked accounts
     */
    getLinkedAccounts: async (ctx: any, createAuth: any) => {
      const { auth, headers } = await authComponent.getAuth(createAuth, ctx)
      return await auth.api.listUserAccounts({
        headers,
      })
    },

    /**
     * Checks if user's email is verified
     *
     * @param ctx - Query context
     * @returns True if email is verified
     */
    isEmailVerified: async (ctx: any) => {
      const authUser = await authComponent.safeGetAuthUser(ctx)
      if (!authUser) {
        return false
      }
      return authUser.emailVerified || false
    },

    /**
     * Checks if two-factor authentication is enabled
     *
     * @param ctx - Query context
     * @param createAuth - Auth creation function
     * @returns True if 2FA is enabled
     */
    isTwoFactorEnabled: async (ctx: any, createAuth: any) => {
      const { auth, headers } = await authComponent.getAuth(createAuth, ctx)
      const twoFactorStatus = await auth.api.twoFactor.getStatus({
        headers,
      })
      return twoFactorStatus.enabled || false
    },
  }
}

/**
 * Helper type for the auth queries object
 */
export type AuthQueries = ReturnType<typeof createAuthQueries>
