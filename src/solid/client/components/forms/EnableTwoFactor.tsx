// packages/convex-better-auth/src/solid/client/components/forms/EnableTwoFactor.tsx

/**
 * Enable Two-Factor Page Component for Solid
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
} from '@tanstack-app/ui/solid'
import ArrowLeft from 'lucide-solid/icons/arrow-left'
import { Show, type Component } from 'solid-js'
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
 * import { EnableTwoFactor } from '@convex-better-auth/solid/client/forms'
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
export const EnableTwoFactor: Component<EnableTwoFactorProps> = (props) => {
  return (
    <div class="min-h-screen w-full flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        {/* Back Button */}
        <Show when={props.onBack}>
          <Button
            variant="ghost"
            size="sm"
            class="flex items-center gap-2 mb-4"
            onClick={props.onBack}
          >
            <ArrowLeft size={16} />
            Back to Settings
          </Button>
        </Show>

        <Card>
          <CardHeader>
            <CardTitle class="text-lg md:text-xl">
              Enable Two-Factor Authentication
            </CardTitle>
            <CardDescription class="text-xs md:text-sm">
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <EnableTwoFactorForm
              onBack={props.onBack}
              onSuccess={props.onSuccess}
              onError={props.onError}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EnableTwoFactor
