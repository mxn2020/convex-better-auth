/**
 * Shared constants used across the auth package
 */

/**
 * Default password requirements
 */
export const DEFAULT_PASSWORD_MIN_LENGTH = 8
export const DEFAULT_PASSWORD_MAX_LENGTH = 128

/**
 * Session and token expiration times (in seconds)
 */
export const DEFAULT_SESSION_EXPIRATION = 7 * 24 * 60 * 60 // 7 days
export const DEFAULT_RESET_PASSWORD_TOKEN_EXPIRATION = 60 * 60 // 1 hour
export const DEFAULT_VERIFICATION_TOKEN_EXPIRATION = 24 * 60 * 60 // 24 hours
export const DEFAULT_MAGIC_LINK_EXPIRATION = 15 * 60 // 15 minutes
export const DEFAULT_OTP_EXPIRATION = 10 * 60 // 10 minutes

/**
 * Rate limiting
 */
export const DEFAULT_EMAIL_RESEND_COOLDOWN = 60 // 60 seconds
export const DEFAULT_MAX_LOGIN_ATTEMPTS = 5
export const DEFAULT_LOGIN_ATTEMPT_WINDOW = 15 * 60 // 15 minutes

/**
 * OTP configuration
 */
export const OTP_LENGTH = 6
export const OTP_VALID_CHARACTERS = '0123456789'

/**
 * 2FA configuration
 */
export const TWO_FACTOR_BACKUP_CODES_COUNT = 10
export const TWO_FACTOR_BACKUP_CODE_LENGTH = 8

/**
 * Email subjects
 */
export const EMAIL_SUBJECT_VERIFICATION = 'Verify your email address'
export const EMAIL_SUBJECT_PASSWORD_RESET = 'Reset your password'
export const EMAIL_SUBJECT_MAGIC_LINK = 'Your magic sign-in link'
export const EMAIL_SUBJECT_OTP = 'Your verification code'

/**
 * Error messages
 */
export const ERROR_INVALID_CREDENTIALS = 'Invalid email or password'
export const ERROR_EMAIL_NOT_VERIFIED = 'Please verify your email address before signing in'
export const ERROR_USER_NOT_FOUND = 'User not found'
export const ERROR_EMAIL_ALREADY_EXISTS = 'An account with this email already exists'
export const ERROR_WEAK_PASSWORD = 'Password does not meet requirements'
export const ERROR_INVALID_TOKEN = 'Invalid or expired token'
export const ERROR_TWO_FACTOR_REQUIRED = 'Two-factor authentication required'
export const ERROR_INVALID_TWO_FACTOR_CODE = 'Invalid two-factor code'
export const ERROR_RATE_LIMIT_EXCEEDED = 'Too many attempts. Please try again later'
export const ERROR_PASSWORDS_DO_NOT_MATCH = 'Passwords do not match'
export const ERROR_INCORRECT_PASSWORD = 'Current password is incorrect'

/**
 * Success messages
 */
export const SUCCESS_ACCOUNT_CREATED = 'Account created successfully'
export const SUCCESS_EMAIL_SENT = 'Email sent successfully'
export const SUCCESS_PASSWORD_CHANGED = 'Password changed successfully'
export const SUCCESS_EMAIL_VERIFIED = 'Email verified successfully'
export const SUCCESS_TWO_FACTOR_ENABLED = 'Two-factor authentication enabled'
export const SUCCESS_TWO_FACTOR_DISABLED = 'Two-factor authentication disabled'

/**
 * Route paths (for redirects)
 */
export const ROUTE_SIGN_IN = '/sign-in'
export const ROUTE_SIGN_UP = '/sign-up'
export const ROUTE_RESET_PASSWORD = '/reset-password'
export const ROUTE_VERIFY_EMAIL = '/verify-email'
export const ROUTE_DASHBOARD = '/dashboard'
export const ROUTE_SETTINGS = '/settings'

/**
 * Local storage keys
 */
export const STORAGE_KEY_REMEMBER_EMAIL = 'auth_remember_email'
export const STORAGE_KEY_LAST_RESEND_TIME = 'auth_last_resend_time'

/**
 * Regex patterns
 */
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const REGEX_UPPERCASE = /[A-Z]/
export const REGEX_LOWERCASE = /[a-z]/
export const REGEX_NUMBER = /\d/
export const REGEX_SPECIAL_CHAR = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/

/**
 * Better Auth component name
 */
export const BETTER_AUTH_COMPONENT_NAME = 'betterAuth'

/**
 * Default branding
 */
export const DEFAULT_BRAND_NAME = 'Better Auth'
export const DEFAULT_BRAND_TAGLINE = 'Simple, secure authentication'
