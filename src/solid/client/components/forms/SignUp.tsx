// packages/convex-better-auth/src/solid/client/components/forms/SignUp.tsx

/**
 * Sign Up Page Component for Solid
 * Handles layout and design for the sign-up page
 * Form logic is delegated to SignUpForm
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tanstack-app/ui/solid'
import { Link } from '@tanstack/solid-router'
import { type Component } from 'solid-js'
import SignUpForm from './SignUpForm'

/**
 * Sign Up page component with layout
 * Use this in your TanStack Router routes
 *
 * @example
 * ```tsx
 * // In your route file:
 * import { SignUp } from '@convex-better-auth/solid/client/forms'
 *
 * export const Route = createFileRoute('/sign-up')({
 *   component: SignUp,
 *   beforeLoad: ({ context }) => {
 *     if (context.isAuthenticated) {
 *       throw redirect({ to: '/' })
 *     }
 *   },
 * })
 * ```
 */
export const SignUp: Component = () => {
  return (
    <div class="min-h-screen w-full flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle class="text-lg md:text-xl">Sign Up</CardTitle>
            <CardDescription class="text-xs md:text-sm">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <SignUpForm />
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

        <p class="text-center mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{' '}
          <Link
            to="/sign-in"
            class="text-orange-400 hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200 underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
