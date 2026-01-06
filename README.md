# Convex Better Auth Package

A reusable, fully-featured authentication package combining [Better Auth](https://better-auth.com) with [Convex](https://convex.dev). This package provides email & password authentication, social OAuth, 2FA, magic links, email OTP, and more - all configured through a simple, type-safe interface.

## Features

✅ **Email & Password Authentication** with customizable requirements
✅ **Email Verification** (optional or required)
✅ **Password Reset** via email links
✅ **Change Password** with optional session revocation
✅ **Social OAuth** (GitHub, Google)
✅ **Magic Link** passwordless authentication
✅ **Email OTP** verification codes
✅ **Two-Factor Authentication** (TOTP with backup codes)
✅ **Anonymous Sign-in**
✅ **Account Deletion**
✅ **React UI Components** (shadcn/ui based)
✅ **Email Templates** (React Email)
✅ **Full TypeScript Support**

## Installation

This package is designed to work as a workspace package. It's already set up in your monorepo at `packages/convex-better-auth`.

## Quick Start

### 1. Server Setup (Convex Backend)

In your `/convex/auth.ts`:

```typescript
import {
  createAuthComponent,
  createAuth,
  createAuthQueries,
  betterAuthSchema,
  type ConvexBetterAuthConfig,
} from '@convex-better-auth/package/server'
import { components, internal } from './_generated/api'
import authConfig from './auth.config'

// Configure your authentication
const authPackageConfig: ConvexBetterAuthConfig = {
  email: {
    from: 'Your App <noreply@example.com>',
  },
  password: {
    minLength: 10,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  emailVerification: {
    required: true, // Users must verify email before signing in
    resendEnabled: true,
    resendCooldownSeconds: 60,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  site: {
    url: process.env.SITE_URL!,
  },
  branding: {
    name: 'Your App',
    tagline: 'Secure authentication',
  },
  hooks: {
    onCreate: async (ctx, authUser) => {
      // Sync to your custom users table
      const userId = await ctx.db.insert('users', {
        email: authUser.email,
      })
      await authComponent.setUserId(ctx, authUser._id, userId)
    },
  },
}

// Create auth component
export const authComponent = createAuthComponent(
  components,
  internal,
  authConfig,
  authPackageConfig,
  betterAuthSchema
)

// Create auth instance factory
export const createAuthInstance = (ctx) =>
  createAuth(ctx, authComponent, authPackageConfig, authConfig, components)

// Export queries
const queries = createAuthQueries(authComponent)
export const { safeGetUser, getUser } = queries
```

### 2. Client Setup (React App)

In your `/src/lib/auth-client.tsx`:

```typescript
export { authClient } from '@convex-better-auth/package/client'
```

### 3. Use Components

In your routes:

```typescript
import { SignIn, SignUp, ResetPassword, Settings } from '@convex-better-auth/package/client'

// Use them directly
export default function SignInPage() {
  return <SignIn />
}
```

## Configuration

### Password Requirements

```typescript
password: {
  minLength: 10,           // Minimum length
  maxLength: 128,          // Maximum length
  requireUppercase: true,  // Require uppercase letters
  requireLowercase: true,  // Require lowercase letters
  requireNumbers: true,    // Require numbers
  requireSpecialChars: true, // Require special characters
}
```

### Email Verification

```typescript
emailVerification: {
  required: true,          // Block sign-in until verified
  resendEnabled: true,     // Allow resending verification emails
  resendCooldownSeconds: 60, // Cooldown between resends
}
```

### Social Providers

```typescript
socialProviders: {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
}
```

### Lifecycle Hooks

```typescript
hooks: {
  onCreate: async (ctx, authUser) => {
    // Called when a new user is created
    // Sync to your custom tables
  },
  onUpdate: async (ctx, newUser, oldUser) => {
    // Called when a user is updated
  },
  onDelete: async (ctx, authUser) => {
    // Called when a user is deleted
    // Clean up related data
  },
}
```

## Components

### SignIn

Email/password, magic link, OTP, social, and anonymous sign-in.

```typescript
import { SignIn } from '@convex-better-auth/package/client'

export default function SignInPage() {
  return <SignIn />
}
```

### SignUp

User registration with email verification support.

```typescript
import { SignUp } from '@convex-better-auth/package/client'

export default function SignUpPage() {
  return <SignUp />
}
```

### Settings

Comprehensive account settings page with:
- Email verification status
- Resend verification email
- Change password
- 2FA management
- Account deletion

```typescript
import { Settings } from '@convex-better-auth/package/client'

export default function SettingsPage() {
  return (
    <Settings
      passwordRequirements={authPackageConfig.password}
      showChangePassword={true}
      showEmailVerification={true}
      showTwoFactor={true}
      showAccountDeletion={true}
    />
  )
}
```

### ChangePassword

Standalone password change component.

```typescript
import { ChangePassword } from '@convex-better-auth/package/client'

export default function ChangePasswordPage() {
  return (
    <ChangePassword
      passwordRequirements={authPackageConfig.password}
      showRevokeSessionsOption={true}
      onSuccess={() => console.log('Password changed!')}
    />
  )
}
```

### ResendVerification

Button to resend verification email with cooldown timer.

```typescript
import { ResendVerification } from '@convex-better-auth/package/client'

export default function VerifyEmailPage() {
  const user = useUser() // Your user hook

  return (
    <div>
      <p>Please verify your email</p>
      <ResendVerification email={user.email} />
    </div>
  )
}
```

## Auth Client API

The `authClient` provides all Better Auth methods:

```typescript
import { authClient } from '@/lib/auth-client'

// Sign up
await authClient.signUp.email({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe',
})

// Sign in
await authClient.signIn.email({
  email: 'user@example.com',
  password: 'password123',
})

// Sign out
await authClient.signOut()

// Change password
await authClient.changePassword({
  currentPassword: 'old',
  newPassword: 'new',
  revokeOtherSessions: true,
})

// Send verification email
await authClient.sendVerificationEmail({
  email: 'user@example.com',
})

// Get session
const { data: session } = authClient.useSession()
```

## Queries

Server-side query utilities:

```typescript
import { safeGetUser, getUser, hasPassword, isEmailVerified } from '~/convex/auth'

// In a Convex query
export const myQuery = query({
  handler: async (ctx) => {
    const user = await getUser(ctx) // Throws if not authenticated
    const userOrNull = await safeGetUser(ctx) // Returns null if not authenticated

    const hasPassword = await queries.hasPassword(ctx, createAuthInstance)
    const verified = await queries.isEmailVerified(ctx)

    return { user, hasPassword, verified }
  },
})
```

## Email Templates

Customize email templates in `/packages/convex-better-auth/src/server/emails/`:

- `verifyEmail.tsx` - Email verification
- `resetPassword.tsx` - Password reset
- `magicLink.tsx` - Magic link sign-in
- `verifyOTP.tsx` - OTP codes

All templates use React Email and support branding configuration.

## Environment Variables

Required:

```env
SITE_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key
RESEND_API_KEY=your-resend-api-key
```

Optional (for social auth):

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  ConvexBetterAuthConfig,
  PasswordRequirements,
  AuthProvider,
  AuthStatus,
  EmailVerificationStatus,
} from '@convex-better-auth/package'
```

## Git Submodule (Optional)

To use this package as a git submodule:

1. Create a separate repository for the package
2. Push the package code
3. In your main project:

```bash
git rm -r packages/convex-better-auth
git submodule add <repo-url> packages/convex-better-auth
```

4. To update:

```bash
cd packages/convex-better-auth
git pull origin main
cd ../..
git add packages/convex-better-auth
git commit -m "Update auth package"
```

## License

MIT

## Credits

- [Better Auth](https://better-auth.com) - Authentication framework
- [Convex](https://convex.dev) - Backend platform
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [React Email](https://react.email) - Email templates
