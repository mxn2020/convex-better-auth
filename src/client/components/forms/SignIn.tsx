// packages/convex-better-auth/src/client/components/forms/SignIn.tsx

/**
 * Sign In Page Component
 * Handles layout and design for the sign-in page
 * Form logic is delegated to SignInForm
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
import SignInForm from './SignInForm'

/**
 * Sign In page component with layout
 * Use this in your TanStack Router routes
 *
 * @example
 * ```tsx
 * // In your route file:
 * import { SignIn } from '@convex-better-auth/client'
 *
 * export const Route = createFileRoute('/sign-in')({
 *   component: SignIn,
 *   beforeLoad: ({ context }) => {
 *     if (context.isAuthenticated) {
 *       throw redirect({ to: '/' })
 *     }
 *   },
 * })
 * ```
 */
export function SignIn() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <SignInForm />
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
          Don't have an account?{' '}
          <Link
            to="/sign-up"
            search={{}}
            className="text-orange-400 hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200 underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
