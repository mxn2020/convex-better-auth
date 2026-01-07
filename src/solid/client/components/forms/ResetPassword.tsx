// packages/convex-better-auth/src/solid/client/components/forms/ResetPassword.tsx

/**
 * Reset Password Page Component for Solid
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
} from '@tanstack-app/ui/solid'
import { useSearch } from '@tanstack/solid-router'
import { Show, type Component } from 'solid-js'
import ResetPasswordForm from './ResetPasswordForm'

/**
 * Reset Password page component with layout
 * Use this in your TanStack Router routes
 *
 * @example
 * ```tsx
 * // In your route file:
 * import { ResetPassword } from '@convex-better-auth/solid/client/forms'
 *
 * export const Route = createFileRoute('/reset-password')({
 *   component: ResetPassword,
 * })
 * // URL: /reset-password?token=abc123
 * ```
 */
export const ResetPassword: Component = () => {
  const searchParams = useSearch({ strict: false })
  const token = () => (searchParams as any).token

  return (
    <div class="min-h-screen w-full flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <Show
          when={token()}
          fallback={
            <Card>
              <CardHeader>
                <CardTitle class="text-lg md:text-xl">Invalid Link</CardTitle>
                <CardDescription class="text-xs md:text-sm">
                  This password reset link is invalid or has expired. Please
                  request a new one.
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <div class="flex justify-center w-full border-t py-4">
                  <p class="text-center text-xs text-neutral-500">
                    Powered by{' '}
                    <a
                      href="https://better-auth.com"
                      class="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span class="dark:text-orange-200/90">better-auth.</span>
                    </a>
                  </p>
                </div>
              </CardFooter>
            </Card>
          }
        >
          <Card>
            <CardHeader>
              <CardTitle class="text-lg md:text-xl">Reset Password</CardTitle>
              <CardDescription class="text-xs md:text-sm">
                Enter your new password below
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ResetPasswordForm token={token()!} />
            </CardContent>

            <CardFooter>
              <div class="flex justify-center w-full border-t py-4">
                <p class="text-center text-xs text-neutral-500">
                  Powered by{' '}
                  <a
                    href="https://better-auth.com"
                    class="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span class="dark:text-orange-200/90">better-auth.</span>
                  </a>
                </p>
              </div>
            </CardFooter>
          </Card>
        </Show>
      </div>
    </div>
  )
}

export default ResetPassword
