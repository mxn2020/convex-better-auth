// packages/convex-better-auth/src/solid/client/components/SignOutButton.tsx

/**
 * Sign Out Button Component for Solid
 * A styled button with icon for signing out
 */

import type { Component } from 'solid-js'
import { Button } from '@tanstack-app/ui/solid'
import { LogOut } from 'lucide-solid'

export interface SignOutButtonProps {
  /** Click handler for sign out action */
  onClick: () => void | Promise<void>
}

/**
 * Sign out button with icon
 * Shows a logout icon with "Sign out" text
 */
export const SignOutButton: Component<SignOutButtonProps> = (props) => {
  return (
    <Button variant="ghost" size="sm" onClick={props.onClick}>
      <LogOut size={16} class="mr-2" />
      Sign out
    </Button>
  )
}
