// packages/convex-better-auth/src/client/components/forms/SignInForm.tsx

/**
 * Sign in form logic component
 * Handles all authentication methods and form state
 * Layout is handled by parent component
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@tanstack-app/ui'
import { Loader2 } from 'lucide-react'
import { useSignIn } from '../../hooks/core/useSignIn'
import { useMagicLink } from '../../hooks/core/useMagicLink'
import { useOTPAuth } from '../../hooks/core/useOTPAuth'
import { useAnonymousAuth } from '../../hooks/core/useAnonymousAuth'
import { useSocialAuth } from '../../hooks/core/useSocialAuth'
import { usePasswordReset } from '../../hooks/password/usePasswordReset'
import { useAuthMethod } from '../../hooks/utils/useAuthMethod'
import { useAuthConfig } from '../../hooks/utils/useAuthConfig'
import { signInSchema, type SignInFormData } from '../../utils/validation'
import { FormField, LoadingButton, MethodToggle } from '../base'
import { SocialButtons } from '../base/SocialButtons'

/**
 * Sign in form with all authentication logic
 * This component only handles the form and auth operations
 * 
 * @example
 * ```tsx
 * <SignInForm />
 * ```
 */
export default function SignInForm() {
  const { isMethodEnabled } = useAuthConfig()
  const {
    selectedMethod,
    setMethod,
    availableGroups,
    passwordlessMethods,
  } = useAuthMethod()

  // Auth hooks
  const signIn = useSignIn()
  const magicLink = useMagicLink()
  const otp = useOTPAuth({ type: 'sign-in' })
  const anonymousAuth = useAnonymousAuth()
  const githubAuth = useSocialAuth('github')
  const googleAuth = useSocialAuth('google')
  const passwordReset = usePasswordReset()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const email = form.watch('email')

  const isLoading =
    signIn.isLoading ||
    magicLink.isLoading ||
    otp.isLoading ||
    anonymousAuth.isLoading ||
    githubAuth.isLoading ||
    googleAuth.isLoading ||
    passwordReset.isLoading

  // Auth handlers
  const handlePasswordSignIn = form.handleSubmit(async (data) => {
    await signIn.signInWithPassword(data.email, data.password)
  })

  const handleMagicLink = async () => {
    if (!email) {
      form.setError('email', { message: 'Email is required' })
      return
    }
    await magicLink.sendMagicLink(email)
  }

  const handleOTPSend = async () => {
    if (!email) {
      form.setError('email', { message: 'Email is required' })
      return
    }
    await otp.sendOTP(email)
  }

  const handleOTPVerify = async (code: string) => {
    if (!email) return
    await otp.verifyOTP(email, code)
  }

  const handleForgotPassword = async () => {
    if (!email) {
      form.setError('email', { message: 'Email is required' })
      return
    }
    await passwordReset.requestReset(email)
  }

  return (
    <form
      onSubmit={
        selectedMethod === 'password'
          ? handlePasswordSignIn
          : (e) => {
              e.preventDefault()
              if (otp.otpSent) {
                const code = (e.target as HTMLFormElement).otp?.value
                if (code) handleOTPVerify(code)
              }
            }
      }
      className="grid gap-4"
    >
      {/* Email Field */}
      <FormField
        label="Email"
        type="email"
        placeholder="m@example.com"
        disabled={isLoading}
        {...form.register('email')}
        error={form.formState.errors.email?.message}
      />

      {/* Password Field */}
      {selectedMethod === 'password' && (
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <Button
              variant="link"
              size="sm"
              type="button"
              onClick={handleForgotPassword}
              className="cursor-pointer"
              disabled={passwordReset.isLoading || !email}
            >
              {passwordReset.isLoading && (
                <Loader2 size={14} className="animate-spin mr-1" />
              )}
              Forgot your password?
            </Button>
          </div>
          <FormField
            id="password"
            type="password"
            placeholder="password"
            autoComplete="password"
            disabled={isLoading}
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
        </div>
      )}

      {/* OTP Input */}
      {selectedMethod === 'passwordless' && otp.otpSent && (
        <FormField
          label="Verification Code"
          name="otp"
          type="text"
          placeholder="Enter verification code"
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={6}
          disabled={isLoading}
        />
      )}

      {/* Auth Buttons */}
      <div className="flex flex-col gap-2">
        {/* Password Sign In */}
        {selectedMethod === 'password' && (
          <LoadingButton
            type="submit"
            className="w-full"
            isLoading={signIn.isLoading}
          >
            Sign in with Password
          </LoadingButton>
        )}

        {/* Passwordless Options */}
        {selectedMethod === 'passwordless' && !otp.otpSent && (
          <div className="flex flex-col gap-2">
            {passwordlessMethods.includes('magic-link') && (
              <LoadingButton
                type="button"
                className="w-full"
                isLoading={magicLink.isLoading}
                disabled={isLoading}
                onClick={handleMagicLink}
              >
                Send Magic Link
              </LoadingButton>
            )}

            {passwordlessMethods.includes('otp') && (
              <LoadingButton
                type="button"
                className="w-full"
                variant="outline"
                isLoading={otp.isLoading}
                disabled={isLoading}
                onClick={handleOTPSend}
              >
                Send Verification Code
              </LoadingButton>
            )}

            {passwordlessMethods.includes('anonymous') && (
              <LoadingButton
                type="button"
                className="w-full"
                variant="outline"
                isLoading={anonymousAuth.isLoading}
                disabled={isLoading}
                onClick={anonymousAuth.signInAnonymously}
              >
                Sign in anonymously
              </LoadingButton>
            )}
          </div>
        )}

        {/* OTP Verify */}
        {selectedMethod === 'passwordless' && otp.otpSent && (
          <>
            <LoadingButton
              type="submit"
              className="w-full"
              isLoading={otp.isLoading}
            >
              Verify Code
            </LoadingButton>

            {otp.canResend ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => otp.resendOTP()}
                disabled={isLoading}
              >
                Resend Code
              </Button>
            ) : (
              <p className="text-xs text-center text-gray-500">
                Resend in {otp.countdown}s
              </p>
            )}
          </>
        )}

        {/* Method Toggle */}
        <MethodToggle
          current={selectedMethod}
          onChange={setMethod}
          available={availableGroups}
        />
      </div>

      {/* Social Auth */}
      {(isMethodEnabled('github') || isMethodEnabled('google')) && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-neutral-500">
                or continue with
              </span>
            </div>
          </div>

          <SocialButtons
            onGithubClick={githubAuth.signIn}
            onGoogleClick={googleAuth.signIn}
            disabled={isLoading}
            showGithub={isMethodEnabled('github')}
            showGoogle={isMethodEnabled('google')}
          />
        </>
      )}
    </form>
  )
}
