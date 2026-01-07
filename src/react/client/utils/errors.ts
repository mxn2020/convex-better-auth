// src/react/client/utils/errors.ts

/**
 * Error handling utilities for auth operations
 */

/**
 * Format an error for display
 * Extracts message from Error object or converts unknown errors to strings
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unknown error occurred'
}

/**
 * Create an Error object from unknown value
 * Ensures we always have a proper Error object
 */
export function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }

  if (typeof error === 'string') {
    return new Error(error)
  }

  return new Error('An unknown error occurred')
}

/**
 * Check if an error is a specific type
 * Useful for handling different error cases
 */
export function isAuthError(error: unknown, type: string): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  // Check if error message contains the type
  return error.message.toLowerCase().includes(type.toLowerCase())
}

/**
 * Common auth error messages
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  WEAK_PASSWORD: 'Password is too weak',
  INVALID_TOKEN: 'Invalid or expired token',
  SESSION_EXPIRED: 'Your session has expired',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const
