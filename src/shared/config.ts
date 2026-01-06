/**
 * Configuration interface for Convex Better Auth package
 * Allows customization of authentication behavior, email settings, password requirements, and more.
 */

export interface PasswordRequirements {
  /** Minimum password length (default: 8) */
  minLength: number
  /** Maximum password length (default: 128) */
  maxLength: number
  /** Require at least one uppercase letter */
  requireUppercase?: boolean
  /** Require at least one lowercase letter */
  requireLowercase?: boolean
  /** Require at least one number */
  requireNumbers?: boolean
  /** Require at least one special character */
  requireSpecialChars?: boolean
}

export interface EmailVerificationConfig {
  /** Require email verification before allowing sign-in */
  required: boolean
  /** Allow users to resend verification emails */
  resendEnabled: boolean
  /** Cooldown period in seconds between resend requests (default: 60) */
  resendCooldownSeconds?: number
}

export interface EmailConfig {
  /** Email address to send from (e.g., "App <noreply@example.com>") */
  from: string
  /** Resend API key (optional, will use env var if not provided) */
  resendApiKey?: string
}

export interface SocialProviders {
  github?: {
    clientId: string
    clientSecret: string
  }
  google?: {
    clientId: string
    clientSecret: string
  }
}

export interface BrandingConfig {
  /** Application name for emails */
  name: string
  /** Tagline for emails */
  tagline: string
  /** Logo URL for emails (optional) */
  logoUrl?: string
}

export interface SiteConfig {
  /** Base URL of the application (e.g., "https://example.com") */
  url: string
}

/**
 * User lifecycle hooks for custom logic
 * These hooks allow you to sync data between Better Auth's user table
 * and your application's custom tables
 */
export interface UserHooks<Ctx = any, AuthUser = any> {
  /** Called when a new user is created */
  onCreate?: (ctx: Ctx, authUser: AuthUser) => Promise<void>
  /** Called when a user is updated */
  onUpdate?: (ctx: Ctx, newUser: AuthUser, oldUser: AuthUser) => Promise<void>
  /** Called when a user is deleted */
  onDelete?: (ctx: Ctx, authUser: AuthUser) => Promise<void>
}

/**
 * Complete configuration interface for the Convex Better Auth package
 */
export interface ConvexBetterAuthConfig<Ctx = any, AuthUser = any> {
  /** Email configuration */
  email: EmailConfig

  /** Password requirements and validation rules */
  password: PasswordRequirements

  /** Email verification configuration */
  emailVerification: EmailVerificationConfig

  /** OAuth social providers (optional) */
  socialProviders?: SocialProviders

  /** Branding configuration for emails */
  branding?: BrandingConfig

  /** Site configuration */
  site: SiteConfig

  /** User lifecycle hooks (optional) */
  hooks?: UserHooks<Ctx, AuthUser>
}

/**
 * Default configuration values
 * These can be overridden by providing custom values in the config
 */
export const defaultConfig: Partial<ConvexBetterAuthConfig> = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
  },
  emailVerification: {
    required: false,
    resendEnabled: true,
    resendCooldownSeconds: 60,
  },
  branding: {
    name: "Better Auth",
    tagline: "Simple, secure authentication",
  },
}

/**
 * Merges user configuration with default values
 */
export function mergeConfig<Ctx = any, AuthUser = any>(
  userConfig: ConvexBetterAuthConfig<Ctx, AuthUser>
): ConvexBetterAuthConfig<Ctx, AuthUser> {
  return {
    ...defaultConfig,
    ...userConfig,
    password: {
      ...defaultConfig.password,
      ...userConfig.password,
    },
    emailVerification: {
      ...defaultConfig.emailVerification,
      ...userConfig.emailVerification,
    },
    branding: {
      ...defaultConfig.branding,
      ...userConfig.branding,
    },
  } as ConvexBetterAuthConfig<Ctx, AuthUser>
}

/**
 * Validates password against configured requirements
 * Returns validation result with detailed error messages
 */
export function validatePassword(
  password: string,
  requirements: PasswordRequirements
): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < requirements.minLength) {
    errors.push(`Must be at least ${requirements.minLength} characters`)
  }

  if (password.length > requirements.maxLength) {
    errors.push(`Must be no more than ${requirements.maxLength} characters`)
  }

  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Must contain at least one uppercase letter')
  }

  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Must contain at least one lowercase letter')
  }

  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Must contain at least one number')
  }

  if (requirements.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Must contain at least one special character')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Gets a human-readable list of password requirements
 * Useful for displaying to users in forms
 */
export function getPasswordRequirementsList(requirements: PasswordRequirements): string[] {
  const list: string[] = []

  list.push(`${requirements.minLength}-${requirements.maxLength} characters`)

  if (requirements.requireUppercase) {
    list.push('At least one uppercase letter')
  }

  if (requirements.requireLowercase) {
    list.push('At least one lowercase letter')
  }

  if (requirements.requireNumbers) {
    list.push('At least one number')
  }

  if (requirements.requireSpecialChars) {
    list.push('At least one special character')
  }

  return list
}
