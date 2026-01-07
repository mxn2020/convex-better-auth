// packages/convex-better-auth/src/client/components/UserProfile.tsx

/**
 * User Profile Component
 * Displays user avatar and basic info
 */

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
export function UserProfile({ user }: UserProfileProps) {
  if (!user) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      {user.image ? (
        <img
          src={user.image}
          alt={user.name}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-200 font-medium">
          {user.name?.[0]?.toUpperCase()}
        </div>
      )}
      <div>
        <h1 className="font-medium">{user.name}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {user.email}
        </p>
      </div>
    </div>
  )
}

export default UserProfile