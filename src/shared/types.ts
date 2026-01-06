/**
 * Shared types used across server and client code
 */

/**
 * Authentication provider types
 */
export type AuthProvider = 'credential' | 'github' | 'google' | 'magic-link' | 'email-otp' | 'anonymous'

/**
 * User authentication status
 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading'

/**
 * Email verification status
 */
export type EmailVerificationStatus = 'verified' | 'unverified' | 'pending'

/**
 * Two-factor authentication status
 */
export type TwoFactorStatus = 'enabled' | 'disabled' | 'pending'

/**
 * Password strength levels
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong'

/**
 * Authentication error codes
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TWO_FACTOR_REQUIRED = 'TWO_FACTOR_REQUIRED',
  INVALID_TWO_FACTOR_CODE = 'INVALID_TWO_FACTOR_CODE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Authentication error interface
 */
export interface AuthError {
  code: AuthErrorCode
  message: string
  details?: Record<string, any>
}

/**
 * User account interface (minimal, common fields)
 */
export interface BaseUser {
  id: string
  email: string
  emailVerified: boolean
  name?: string
  image?: string
  createdAt: number
  updatedAt: number
}

/**
 * User session interface
 */
export interface UserSession {
  userId: string
  token: string
  expiresAt: number
  ipAddress?: string
  userAgent?: string
  createdAt: number
}

/**
 * Account link interface (for social providers)
 */
export interface LinkedAccount {
  providerId: AuthProvider
  providerAccountId: string
  userId: string
  createdAt: number
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  valid: boolean
  errors: string[]
  strength?: PasswordStrength
}

/**
 * Email send result
 */
export interface EmailSendResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Verification email data
 */
export interface VerificationEmailData {
  to: string
  url: string
  token: string
}

/**
 * Password reset email data
 */
export interface PasswordResetEmailData {
  to: string
  url: string
  token: string
}

/**
 * Magic link email data
 */
export interface MagicLinkEmailData {
  to: string
  url: string
  token: string
}

/**
 * OTP email data
 */
export interface OTPEmailData {
  to: string
  code: string
}

/**
 * Rate limiting result
 */
export interface RateLimitResult {
  allowed: boolean
  remainingAttempts?: number
  resetAt?: number
}
