// packages/convex-better-auth/src/client/components/forms/ResetPassword.tsx

/**
 * Reset Password Page Component
 * Handles layout and design for the password reset page
 * Form logic is delegated to ResetPasswordForm
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tanstack-app/ui'
import { useSearch } from '@tanstack/react-router'
import ResetPasswordForm from './ResetPasswordForm'

/**
 * Reset Password page component with layout
 * Use this in your TanStack Router routes
 *
 * @example
 * ```tsx
 * // In your route file:
 * import { ResetPassword } from '@convex-better-auth/client'
 *
 * export const Route = createFileRoute('/reset-password')({
 *   component: ResetPassword,
 * })
 * // URL: /reset-password?token=abc123
 * ```
 */
export function ResetPassword() {
  const searchParams = useSearch({ strict: false })
  const token: string | undefined = (searchParams as any).token

  // Show error if no token
  if (!token) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Invalid Link</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                This password reset link is invalid or has expired. Please
                request a new one.
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <div className="flex justify-center w-full border-t py-4">
                <p className="text-center text-xs text-neutral-500">
                  Powered by{' '}
                  <a
                    href="https://better-auth.com"
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="dark:text-orange-200/90">better-auth.</span>
                  </a>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Reset Password</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Enter your new password below
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ResetPasswordForm token={token} />
          </CardContent>

          <CardFooter>
            <div className="flex justify-center w-full border-t py-4">
              <p className="text-center text-xs text-neutral-500">
                Powered by{' '}
                <a
                  href="https://better-auth.com"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="dark:text-orange-200/90">better-auth.</span>
                </a>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ResetPassword
