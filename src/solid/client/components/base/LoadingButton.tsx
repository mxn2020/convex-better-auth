// src/solid/client/components/base/LoadingButton.tsx

/**
 * Button component with integrated loading state
 * Shows spinner when loading
 */

import type { Component, JSX } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import Loader2 from 'lucide-solid/icons/loader-2'
import { Button, type ButtonProps } from '@tanstack-app/ui/solid'

export interface LoadingButtonProps extends ButtonProps {
  /** Whether button is in loading state */
  isLoading?: boolean

  /** Text to show when loading (optional) */
  loadingText?: string
}

export const LoadingButton: Component<LoadingButtonProps> = (props) => {
  const [local, buttonProps] = splitProps(props, [
    'isLoading',
    'loadingText',
    'disabled',
    'children',
  ])

  const isDisabled = () => local.disabled || local.isLoading

  return (
    <Button disabled={isDisabled()} {...buttonProps}>
      <Show when={local.isLoading} fallback={local.children as JSX.Element}>
        <span class="inline-flex items-center">
          <Loader2 size={16} class="animate-spin mr-2" />
          {local.loadingText ?? local.children}
        </span>
      </Show>
    </Button>
  )
}
