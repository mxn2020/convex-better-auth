// packages/convex-better-auth/src/solid/client/components/forms/SignInForm.tsx

/**
 * Sign in form logic component for Solid
 * Handles all authentication methods and form state
 * Layout is handled by parent component
 */

import { Button } from '@tanstack-app/ui/solid'
import Loader2 from 'lucide-solid/icons/loader-2'
import { createSignal, Show, type Component } from 'solid-js'
import { createSignIn } from '../../composables/core/createSignIn'
import { createMagicLink } from '../../composables/core/createMagicLink'
import { createOTPAuth } from '../../composables/core/createOTPAuth'
import { createAnonymousAuth } from '../../composables/core/createAnonymousAuth'
import { createSocialAuth } from '../../composables/core/createSocialAuth'
import { createPasswordReset } from '../../composables/password/createPasswordReset'
import { createAuthMethod } from '../../composables/utils/createAuthMethod'
import { createAuthConfig } from '../../composables/utils/createAuthConfig'
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
export const SignInForm: Component = () => {
  const { isMethodEnabled } = createAuthConfig()
  const {
    selectedMethod,
    setMethod,
    availableGroups,
    passwordlessMethods,
  } = createAuthMethod()

  // Auth composables
  const signIn = createSignIn()
  const magicLink = createMagicLink()
  const otp = createOTPAuth({ type: 'sign-in' })
  const anonymousAuth = createAnonymousAuth()
  const githubAuth = createSocialAuth('github')
  const googleAuth = createSocialAuth('google')
  const passwordReset = createPasswordReset()

  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [errors, setErrors] = createSignal<{
    email?: string
    password?: string
  }>({})

  const isLoading = () =>
    signIn.isLoading() ||
    magicLink.isLoading() ||
    otp.isLoading() ||
    anonymousAuth.isLoading() ||
    githubAuth.isLoading() ||
    googleAuth.isLoading() ||
    passwordReset.isLoading()

  // Validation
  const validateEmail = () => {
    if (!email()) {
      setErrors({ ...errors(), email: 'Email is required' })
      return false
    }
    return true
  }

  const validateForm = () => {
    const newErrors: {
      email?: string
      password?: string
    } = {}

    if (!email()) {
      newErrors.email = 'Email is required'
    }

    if (selectedMethod() === 'password' && !password()) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Auth handlers
  const handlePasswordSignIn = async (e: Event) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    console.log('Submitting password sign-in for', email())
    await signIn.signInWithPassword(email(), password())
  }

  const handleMagicLink = async () => {
    if (!validateEmail()) {
      return
    }
    await magicLink.sendMagicLink(email())
  }

  const handleOTPSend = async () => {
    if (!validateEmail()) {
      return
    }
    await otp.sendOTP(email())
  }

  const handleOTPVerify = async (code: string) => {
    if (!email()) return
    await otp.verifyOTP(email(), code)
  }

  const handleForgotPassword = async () => {
    if (!validateEmail()) {
      return
    }
    await passwordReset.requestReset(email())
  }

  const handleFormSubmit = async (e: Event) => {
    e.preventDefault()

    if (selectedMethod() === 'password') {
      await handlePasswordSignIn(e)
    } else if (otp.otpSent()) {
      const target = e.target as HTMLFormElement
      const code = target.otp?.value
      if (code) await handleOTPVerify(code)
    }
  }

  return (
    <form onSubmit={handleFormSubmit} class="grid gap-4">
      {/* Email Field */}
      <FormField
        label="Email"
        type="email"
        placeholder="m@example.com"
        disabled={isLoading()}
        value={email()}
        onInput={(e: InputEvent) => setEmail((e.target as HTMLInputElement).value)}
        error={errors().email}
      />

      {/* Password Field */}
      <Show when={selectedMethod() === 'password'}>
        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="password"
          autocomplete="password"
          disabled={isLoading()}
          value={password()}
          onInput={(e: InputEvent) => setPassword((e.target as HTMLInputElement).value)}
          error={errors().password}
          labelAction={
            <Button
              variant="link"
              size="sm"
              type="button"
              onClick={handleForgotPassword}
              class="cursor-pointer"
              disabled={passwordReset.isLoading() || !email()}
            >
              <Show when={passwordReset.isLoading()}>
                <Loader2 size={14} class="animate-spin mr-1" />
              </Show>
              Forgot your password?
            </Button>
          }
        />
      </Show>

      {/* OTP Input */}
      <Show when={selectedMethod() === 'passwordless' && otp.otpSent()}>
        <FormField
          label="Verification Code"
          name="otp"
          type="text"
          placeholder="Enter verification code"
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={6}
          disabled={isLoading()}
        />
      </Show>

      {/* Auth Buttons */}
      <div class="flex flex-col gap-2">
        {/* Password Sign In */}
        <Show when={selectedMethod() === 'password'}>
          <LoadingButton
            type="submit"
            class="w-full"
            isLoading={signIn.isLoading()}
          >
            Sign in with Password
          </LoadingButton>
        </Show>

        {/* Passwordless Options */}
        <Show when={selectedMethod() === 'passwordless' && !otp.otpSent()}>
          <div class="flex flex-col gap-2">
            <Show when={passwordlessMethods().includes('magic-link')}>
              <LoadingButton
                type="button"
                class="w-full"
                isLoading={magicLink.isLoading()}
                disabled={isLoading()}
                onClick={handleMagicLink}
              >
                Send Magic Link
              </LoadingButton>
            </Show>

            <Show when={passwordlessMethods().includes('otp')}>
              <LoadingButton
                type="button"
                class="w-full"
                variant="outline"
                isLoading={otp.isLoading()}
                disabled={isLoading()}
                onClick={handleOTPSend}
              >
                Send Verification Code
              </LoadingButton>
            </Show>

            <Show when={passwordlessMethods().includes('anonymous')}>
              <LoadingButton
                type="button"
                class="w-full"
                variant="outline"
                isLoading={anonymousAuth.isLoading()}
                disabled={isLoading()}
                onClick={anonymousAuth.signInAnonymously}
              >
                Sign in anonymously
              </LoadingButton>
            </Show>
          </div>
        </Show>

        {/* OTP Verify */}
        <Show when={selectedMethod() === 'passwordless' && otp.otpSent()}>
          <>
            <LoadingButton
              type="submit"
              class="w-full"
              isLoading={otp.isLoading()}
            >
              Verify Code
            </LoadingButton>

            <Show
              when={otp.canResend()}
              fallback={
                <p class="text-xs text-center text-gray-500">
                  Resend in {otp.countdown()}s
                </p>
              }
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => otp.resendOTP()}
                disabled={isLoading()}
              >
                Resend Code
              </Button>
            </Show>
          </>
        </Show>

        {/* Method Toggle */}
        <MethodToggle
          current={selectedMethod()}
          onChange={setMethod}
          available={availableGroups()}
        />
      </div>

      {/* Social Auth */}
      <Show when={isMethodEnabled('github') || isMethodEnabled('google')}>
        <>
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t border-neutral-800" />
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="bg-card px-2 text-neutral-500">
                or continue with
              </span>
            </div>
          </div>

          <SocialButtons
            onGithubClick={githubAuth.signIn}
            onGoogleClick={googleAuth.signIn}
            disabled={isLoading()}
            showGithub={isMethodEnabled('github')}
            showGoogle={isMethodEnabled('google')}
          />
        </>
      </Show>
    </form>
  )
}

export default SignInForm
