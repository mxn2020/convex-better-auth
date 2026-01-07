/**
 * Form validation schemas using Zod
 * Provides type-safe form validation for all auth forms
 */

import { z } from 'zod'

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address')

/**
 * Password validation schema (basic)
 * For more complex validation, use usePasswordValidation hook
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')

/**
 * Sign-in form schema
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export type SignInFormData = z.infer<typeof signInSchema>

/**
 * Sign-up form schema
 */
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().optional(),
  image: z.string().optional(),
})

export type SignUpFormData = z.infer<typeof signUpSchema>

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

export type PasswordResetRequestFormData = z.infer<
  typeof passwordResetRequestSchema
>

/**
 * Password reset schema (with token)
 */
export const passwordResetSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>

/**
 * Change password schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
    revokeOtherSessions: z.boolean().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

/**
 * OTP verification schema
 */
export const otpSchema = z.object({
  email: emailSchema,
  otp: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
})

export type OTPFormData = z.infer<typeof otpSchema>

/**
 * Magic link schema
 */
export const magicLinkSchema = z.object({
  email: emailSchema,
})

export type MagicLinkFormData = z.infer<typeof magicLinkSchema>

/**
 * Two-factor enable schema (password step)
 */
export const twoFactorPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export type TwoFactorPasswordFormData = z.infer<typeof twoFactorPasswordSchema>

/**
 * Two-factor verify schema (TOTP code)
 */
export const twoFactorVerifySchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
})

export type TwoFactorVerifyFormData = z.infer<typeof twoFactorVerifySchema>

/**
 * Resend verification schema
 */
export const resendVerificationSchema = z.object({
  email: emailSchema,
})

export type ResendVerificationFormData = z.infer<
  typeof resendVerificationSchema
>
