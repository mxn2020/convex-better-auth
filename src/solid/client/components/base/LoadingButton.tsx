// packages/convex-better-auth/src/solid/client/components/base/LoadingButton.tsx

/**
 * Button component with integrated loading state for Solid
 * Shows spinner when loading
 */

import type { Component, JSX } from 'solid-js'
import { Show } from 'solid-js'
import { Loader2 } from 'lucide-solid'
import { Button, type ButtonProps } from '@tanstack-app/ui/solid'

export interface LoadingButtonProps extends ButtonProps {
  /** Whether button is in loading state */
  isLoading?: boolean

  /** Text to show when loading (optional) */
  loadingText?: string

  /** Button content */
  children?: JSX.Element
}

/**
 * Button with loading state
 * Automatically shows spinner and disables when loading
 *
 * @example
 * ```tsx
 * <LoadingButton
 *   isLoading={loading()}
 *   loadingText="Signing in..."
 *   onClick={handleSubmit}
 * >
 *   Sign In
 * </LoadingButton>
 * ```
 */
export const LoadingButton: Component<LoadingButtonProps> = (props) => {
  return (
    <Button disabled={props.disabled || props.isLoading} {...props}>
      <Show
        when={!props.isLoading}
        fallback={
          <>
            <Loader2 size={16} class="animate-spin mr-2" />
            {props.loadingText || props.children}
          </>
        }
      >
        {props.children}
      </Show>
    </Button>
  )
}
