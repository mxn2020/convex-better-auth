// packages/convex-better-auth/src/solid/client/components/UserProfile.tsx

/**
 * User Profile Component for Solid
 * Displays user avatar and basic info
 */

import type { Component } from 'solid-js'
import { Show } from 'solid-js'

export interface UserProfileProps {
  /** User object with name, email, and optional image */
  user: {
    name: string
    email: string
    image?: string | null
  } | null
}

/**
 * User profile display component
 * Shows user avatar (or initials) with name and email
 *
 * @example
 * ```tsx
 * <UserProfile
 *   user={{
 *     name: "John Doe",
 *     email: "john@example.com",
 *     image: "https://..."
 *   }}
 * />
 * ```
 */
export const UserProfile: Component<UserProfileProps> = (props) => {
  return (
    <Show when={props.user}>
      {(user) => (
        <div class="flex items-center space-x-2">
          <Show
            when={user().image}
            fallback={
              <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-200 font-medium">
                {user().name?.[0]?.toUpperCase()}
              </div>
            }
          >
            <img
              src={user().image!}
              alt={user().name}
              width={40}
              height={40}
              class="rounded-full"
            />
          </Show>
          <div>
            <h1 class="font-medium">{user().name}</h1>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              {user().email}
            </p>
          </div>
        </div>
      )}
    </Show>
  )
}

export default UserProfile
