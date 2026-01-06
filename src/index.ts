/**
 * Convex Better Auth Package
 * Reusable authentication package for Convex + Better Auth
 *
 * @packageDocumentation
 */

// Re-export everything from server
export * from './server'

// Re-export everything from client
export * from './client'

// Re-export everything from shared
export * from './shared/config'
export * from './shared/types'
export * from './shared/constants'

// Export Better Auth schema
export { default as betterAuthSchema } from '../betterAuth/schema'
