// packages/convex-better-auth/src/solid/client/components/forms/SignUpForm.tsx

/**
 * Sign up form logic component for Solid
 * Handles all authentication methods and form state
 * Layout is handled by parent component
 */

import { Input } from '@tanstack-app/ui/solid'
import { createSignal, Show, type Component } from 'solid-js'
import { X } from 'lucide-solid'
import { createSignUp } from '../../composables/core/createSignUp'
import { createSocialAuth } from '../../composables/core/createSocialAuth'
import { createAuthConfig } from '../../composables/utils/createAuthConfig'
import { FormField, LoadingButton } from '../base'
import { SocialButtons } from '../base/SocialButtons'

/**
 * Sign up form with all authentication logic
 * This component only handles the form and auth operations
 *
 * @example
 * ```tsx
 * <SignUpForm />
 * ```
 */
export const SignUpForm: Component = () => {
  const { config, isMethodEnabled } = createAuthConfig()
  const { signUp, uploadImage, isLoading } = createSignUp()
  const githubAuth = createSocialAuth('github')
  const googleAuth = createSocialAuth('google')

  const [firstName, setFirstName] = createSignal('')
  const [lastName, setLastName] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [imageFile, setImageFile] = createSignal<File | null>(null)
  const [imagePreview, setImagePreview] = createSignal<string | null>(null)
  const [imageBase64, setImageBase64] = createSignal('')

  const [errors, setErrors] = createSignal<{
    firstName?: string
    lastName?: string
    email?: string
    password?: string
  }>({})

  const showProfileImage = config().features?.showProfileImage ?? true

  const isAnyLoading = () =>
    isLoading() || githubAuth.isLoading() || googleAuth.isLoading()

  // Image handlers
  const handleImageChange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Convert to base64 for form
      try {
        const base64 = await uploadImage(file)
        setImageBase64(base64)
      } catch (error) {
        // Error handled by hook
      }
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageBase64('')
  }

  // Validation
  const validate = () => {
    const newErrors: {
      firstName?: string
      lastName?: string
      email?: string
      password?: string
    } = {}

    if (!email()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email())) {
      newErrors.email = 'Invalid email address'
    }

    if (!password()) {
      newErrors.password = 'Password is required'
    } else if (password().length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Auth handler
  const onSubmit = async (e: Event) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    await signUp({
      email: email(),
      password: password(),
      firstName: firstName(),
      lastName: lastName(),
      image: imageBase64(),
    })
  }

  return (
    <form onSubmit={onSubmit} class="grid gap-4">
      {/* Social Sign Up */}
      <Show when={isMethodEnabled('github') || isMethodEnabled('google')}>
        <>
          <SocialButtons
            onGithubClick={githubAuth.signIn}
            onGoogleClick={googleAuth.signIn}
            disabled={isAnyLoading()}
            showGithub={isMethodEnabled('github')}
            showGoogle={isMethodEnabled('google')}
          />

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <span class="w-full border-t border-neutral-800" />
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="bg-card px-2 text-neutral-500">
                or continue with email
              </span>
            </div>
          </div>
        </>
      </Show>

      {/* Name Fields */}
      <div class="grid grid-cols-2 gap-4">
        <FormField
          label="First name"
          placeholder="Max"
          disabled={isAnyLoading()}
          value={firstName()}
          onInput={(e: InputEvent) => setFirstName((e.target as HTMLInputElement).value)}
          error={errors().firstName}
        />
        <FormField
          label="Last name"
          placeholder="Robinson"
          disabled={isAnyLoading()}
          value={lastName()}
          onInput={(e: InputEvent) => setLastName((e.target as HTMLInputElement).value)}
          error={errors().lastName}
        />
      </div>

      {/* Email Field */}
      <FormField
        label="Email"
        type="email"
        placeholder="m@example.com"
        disabled={isAnyLoading()}
        value={email()}
        onInput={(e: InputEvent) => setEmail((e.target as HTMLInputElement).value)}
        error={errors().email}
      />

      {/* Password Field */}
      <FormField
        label="Password"
        type="password"
        placeholder="Enter your password"
        autocomplete="new-password"
        disabled={isAnyLoading()}
        value={password()}
        onInput={(e: InputEvent) => setPassword((e.target as HTMLInputElement).value)}
        error={errors().password}
      />

      {/* Profile Image */}
      <Show when={showProfileImage}>
        <div class="grid gap-2">
          <label
            for="image"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Profile Image (optional)
          </label>
          <div class="flex items-end gap-4">
            <Show when={imagePreview()}>
              <div class="relative w-16 h-16 rounded-sm overflow-hidden">
                <img
                  src={imagePreview()!}
                  alt="Profile preview"
                  class="w-full h-full object-cover"
                />
              </div>
            </Show>
            <div class="flex items-center gap-2 w-full">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isAnyLoading()}
                class="w-full"
              />
              <Show when={imagePreview()}>
                <X
                  class="cursor-pointer"
                  onClick={handleRemoveImage}
                />
              </Show>
            </div>
          </div>
        </div>
      </Show>

      {/* Submit Button */}
      <LoadingButton
        type="submit"
        class="w-full"
        isLoading={isLoading()}
        loadingText="Creating account..."
      >
        Create an account
      </LoadingButton>
    </form>
  )
}

export default SignUpForm
