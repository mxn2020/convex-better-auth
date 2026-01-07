// packages/convex-better-auth/src/client/components/base/LoadingButton.tsx

/**
 * Button component with integrated loading state
 * Shows spinner when loading
 */

import { Loader2 } from 'lucide-react'
import { Button, type ButtonProps } from '@tanstack-app/ui'

export interface LoadingButtonProps extends ButtonProps {
  /** Whether button is in loading state */
  isLoading?: boolean

  /** Text to show when loading (optional) */
  loadingText?: string
}

/**
 * Button with loading state
 * Automatically shows spinner and disables when loading
 *
 * @example
 * ```tsx
 * <LoadingButton
 *   isLoading={isSubmitting}
 *   loadingText="Signing in..."
 *   onClick={handleSubmit}
 * >
 *   Sign In
 * </LoadingButton>
 * ```
 */
export function LoadingButton({
  isLoading,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin mr-2" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
