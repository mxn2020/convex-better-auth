// packages/convex-better-auth/src/client/components/forms/SignUpForm.tsx

/**
 * Sign up form logic component
 * Handles all authentication methods and form state
 * Layout is handled by parent component
 */

import { Input } from '@tanstack-app/ui'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useSignUp } from '../../hooks/core/useSignUp'
import { useSocialAuth } from '../../hooks/core/useSocialAuth'
import { useAuthConfig } from '../../hooks/utils/useAuthConfig'
import { signUpSchema, type SignUpFormData } from '../../utils/validation'
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
export default function SignUpForm() {
  const { config, isMethodEnabled } = useAuthConfig()
  const { signUp, uploadImage, isLoading } = useSignUp()
  const githubAuth = useSocialAuth('github')
  const googleAuth = useSocialAuth('google')

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      image: '',
    },
  })

  const showProfileImage = config.features?.showProfileImage ?? true

  const isAnyLoading =
    isLoading || githubAuth.isLoading || googleAuth.isLoading

  // Image handlers
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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
        form.setValue('image', base64)
      } catch (error) {
        // Error handled by hook
      }
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    form.setValue('image', '')
  }

  // Auth handler
  const onSubmit = form.handleSubmit(async (data) => {
    await signUp(data)
  })

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {/* Social Sign Up */}
      {(isMethodEnabled('github') || isMethodEnabled('google')) && (
        <>
          <SocialButtons
            onGithubClick={githubAuth.signIn}
            onGoogleClick={googleAuth.signIn}
            disabled={isAnyLoading}
            showGithub={isMethodEnabled('github')}
            showGoogle={isMethodEnabled('google')}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-neutral-500">
                or continue with email
              </span>
            </div>
          </div>
        </>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="First name"
          placeholder="Max"
          disabled={isAnyLoading}
          {...form.register('firstName')}
          error={form.formState.errors.firstName?.message}
        />
        <FormField
          label="Last name"
          placeholder="Robinson"
          disabled={isAnyLoading}
          {...form.register('lastName')}
          error={form.formState.errors.lastName?.message}
        />
      </div>

      {/* Email Field */}
      <FormField
        label="Email"
        type="email"
        placeholder="m@example.com"
        disabled={isAnyLoading}
        {...form.register('email')}
        error={form.formState.errors.email?.message}
      />

      {/* Password Field */}
      <FormField
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="new-password"
        disabled={isAnyLoading}
        {...form.register('password')}
        error={form.formState.errors.password?.message}
      />

      {/* Profile Image */}
      {showProfileImage && (
        <div className="grid gap-2">
          <label
            htmlFor="image"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Profile Image (optional)
          </label>
          <div className="flex items-end gap-4">
            {imagePreview && (
              <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-2 w-full">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isAnyLoading}
                className="w-full"
              />
              {imagePreview && (
                <X
                  className="cursor-pointer"
                  onClick={handleRemoveImage}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <LoadingButton
        type="submit"
        className="w-full"
        isLoading={isLoading}
        loadingText="Creating account..."
      >
        Create an account
      </LoadingButton>
    </form>
  )
}
