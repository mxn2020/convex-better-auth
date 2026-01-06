// packages/convex-better-auth/src/client/components/forms/SignUp.tsx

/**
 * Sign Up Page Component
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
} from '@tanstack-app/ui'
import { Link } from '@tanstack/react-router'
import SignUpForm from './SignUpForm'

/**
 * Sign Up page component with layout
 * Use this in your TanStack Router routes
 *
 * @example
 * ```tsx
 * // In your route file:
 * import { SignUp } from '@convex-better-auth/client'
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
export function SignUp() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <SignUpForm />
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

        <p className="text-center mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{' '}
          <Link
            to="/sign-in"
            search={{}}
            className="text-orange-400 hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200 underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
