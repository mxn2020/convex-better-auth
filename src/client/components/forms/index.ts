// packages/convex-better-auth/src/client/components/forms/index.ts

/**
 * Auth forms and page components
 *
 * Page Components (for routes):
 * - SignIn, SignUp, ResetPassword, Settings, EnableTwoFactor, ChangePassword, ResendVerification
 *
 * Form Components (for custom UIs):
 * - SignInForm, SignUpForm, ResetPasswordForm, ChangePasswordForm,
 *   EnableTwoFactorForm, ResendVerificationForm, SettingsContent
 */

// Page Components (use these in TanStack Router routes)
export { SignIn } from './SignIn'
export { SignUp } from './SignUp'
export { ResetPassword } from './ResetPassword'
export { Settings } from './Settings'
export { EnableTwoFactor } from './EnableTwoFactor'
export { ChangePassword } from './ChangePassword'
export { ResendVerification } from './ResendVerification'

// Form Components (use these for custom UIs or composition)
export { default as SignInForm } from './SignInForm'
export { default as SignUpForm } from './SignUpForm'
export { default as ResetPasswordForm } from './ResetPasswordForm'
export { default as ChangePasswordForm } from './ChangePasswordForm'
export { default as EnableTwoFactorForm } from './EnableTwoFactorForm'
export {
  ResendVerificationForm,
  ResendVerificationLink,
} from './ResendVerificationForm'
export { default as SettingsContent } from './SettingsContent'

// Export types
// export type { SignInProps } from './SignIn'
// export type { SignUpProps } from './SignUp'
// export type { ResetPasswordProps } from './ResetPassword'
export type { SettingsProps } from './Settings'
export type { EnableTwoFactorProps } from './EnableTwoFactor'
export type { ChangePasswordProps } from './ChangePassword'
export type { ResendVerificationProps } from './ResendVerification'
export type { ResetPasswordFormProps } from './ResetPasswordForm'
export type { ChangePasswordFormProps } from './ChangePasswordForm'
export type { EnableTwoFactorFormProps } from './EnableTwoFactorForm'
export type { ResendVerificationFormProps } from './ResendVerificationForm'
export type { SettingsContentProps } from './SettingsContent'
