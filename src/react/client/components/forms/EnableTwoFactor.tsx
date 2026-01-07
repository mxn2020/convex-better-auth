// packages/convex-better-auth/src/client/components/forms/EnableTwoFactor.tsx

/**
 * Enable Two-Factor Page Component
 * Handles layout and design for the 2FA setup page
 * Form logic is delegated to EnableTwoFactorForm
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from '@tanstack-app/ui'
import { ArrowLeft } from 'lucide-react'
import EnableTwoFactorForm from './EnableTwoFactorForm'

export interface EnableTwoFactorProps {
  /** Callback when user clicks back button */
  onBack?: () => void

  /** Callback when 2FA is successfully enabled */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void
}

/**
 * Enable Two-Factor page component with layout
 * Use this in your TanStack Router routes
 *
 * @example
 * ```tsx
 * // In your route file:
 * import { EnableTwoFactor } from '@convex-better-auth/client'
 *
 * export const Route = createFileRoute('/settings/2fa')({
 *   component: () => (
 *     <EnableTwoFactor
 *       onBack={() => navigate('/settings')}
 *       onSuccess={() => console.log('2FA enabled!')}
 *     />
 *   ),
 *   beforeLoad: ({ context }) => {
 *     if (!context.isAuthenticated) {
 *       throw redirect({ to: '/sign-in' })
 *     }
 *   },
 * })
 * ```
 */
export function EnableTwoFactor({
  onBack,
  onSuccess,
  onError,
}: EnableTwoFactorProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 mb-4"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            Back to Settings
          </Button>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Enable Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <EnableTwoFactorForm
              onBack={onBack}
              onSuccess={onSuccess}
              onError={onError}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EnableTwoFactor
