/**
 * Shared type definitions for Convex Better Auth
 * These types can be used on both client and server sides
 */

export type AuthProvider = 'email' | 'github' | 'google'

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading'

export type EmailVerificationStatus = 'verified' | 'unverified' | 'pending'

export type TwoFactorStatus = 'enabled' | 'disabled' | 'pending'

export type PasswordStrength = 'weak' | 'medium' | 'strong'
