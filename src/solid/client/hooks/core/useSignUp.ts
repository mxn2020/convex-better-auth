/**
 * Hook for user registration/sign-up in Solid
 * Handles email/password registration with optional profile image
 */

import { createSignal } from 'solid-js'
import { useNavigate } from '@tanstack/solid-router'
import { toast } from 'solid-sonner'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useAuthError } from '../utils/useAuthError'

/**
 * Sign-up data interface
 */
export interface SignUpData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  name?: string
  image?: string
}

/**
 * Options for useSignUp hook
 */
export interface UseSignUpOptions {
  /** Callback on successful sign-up */
  onSuccess?: (data: any) => void

  /** Callback on error */
  onError?: (error: Error) => void

  /** Custom redirect path (overrides config) */
  redirectTo?: string

  /** Disable auto-navigation after sign-up */
  disableAutoNavigate?: boolean
}

/**
 * Converts image File to base64 string
 */
async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Hook for user registration
 * Provides sign-up functionality with optional profile image upload
 *
 * @example
 * ```tsx
 * function SignUpForm() {
 *   const { signUp, uploadImage, isLoading } = useSignUp()
 *
 *   const handleSubmit = async (data: SignUpData) => {
 *     await signUp(data)
 *   }
 *
 *   const handleImageChange = async (file: File) => {
 *     const base64 = await uploadImage(file)
 *     // Use base64 in form data
 *   }
 * }
 * ```
 */
export function useSignUp(options: UseSignUpOptions = {}) {
  const navigate = useNavigate()
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)
  const [data, setData] = createSignal<any>(null)

  /**
   * Upload and convert image to base64
   */
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const base64 = await convertImageToBase64(file)
      return base64
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to process image')
      handleError(error, 'upload image')
      throw error
    }
  }

  /**
   * Sign up with email and password
   */
  const signUp = async (signUpData: SignUpData) => {
    setIsLoading(true)
    setError(null)
    setData(null)

    try {
      const result = await authClient.signUp.email(
        {
          email: signUpData.email,
          password: signUpData.password,
          name:
            signUpData.name ||
            [signUpData.firstName, signUpData.lastName]
              .filter(Boolean)
              .join(' '),
          image: signUpData.image,
        },
        {
          onRequest: () => {
            setIsLoading(true)
          },
          onSuccess: async (ctx) => {
            setData(ctx.data)

            const successMessage =
              config.ui?.successMessages?.['sign-up'] ||
              'Account created successfully!'

            toast.success(successMessage)

            // Reload page for Convex to pick up auth state
            // Router will handle redirect based on new auth state
            if (!options.disableAutoNavigate) {
              window.location.reload()
            }

            options.onSuccess?.(ctx.data)
            config.onSuccess?.('sign-up', ctx.data)
          },
          onError: (ctx) => {
            const err = new Error(ctx.error.message)
            setError(err)
            handleError(err, 'sign up')
            options.onError?.(err)
          },
        }
      )

      // Handle error from result
      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign up failed')
      setError(error)
      handleError(error, 'sign up')
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Reset hook state
   */
  const reset = () => {
    setError(null)
    setData(null)
  }

  return {
    /** Sign up with email and password */
    signUp,

    /** Upload and convert image to base64 */
    uploadImage,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Response data (if successful) */
    data,

    /** Reset hook state */
    reset,
  }
}
