// packages/convex-better-auth/src/client/components/SignOutButton.tsx

/**
 * Sign Out Button Component
 * A styled button with icon for signing out
 */

import { Button } from "@tanstack-app/ui";
import { LogOut } from "lucide-react";

export interface SignOutButtonProps {
  /** Click handler for sign out action */
  onClick: () => void | Promise<void>;
}

/**
 * Sign out button with icon
 * Shows a logout icon with "Sign out" text
 */
export function SignOutButton({ onClick }: SignOutButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <LogOut size={16} className="mr-2" />
      Sign out
    </Button>
  );
}
