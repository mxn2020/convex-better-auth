# Migration Guide

This guide helps you migrate an existing Convex + Better Auth project to use this reusable package.

## Overview

The migration process involves:
1. Installing the package in your workspace
2. Creating a configuration object
3. Updating server-side imports
4. Updating client-side imports
5. Testing all auth flows
6. Removing old files

## Step-by-Step Migration

### Step 1: Package Setup

The package is already set up in your workspace at `packages/convex-better-auth`.

Verify it's recognized:

```bash
npm install
# or
pnpm install
```

### Step 2: Create Configuration

In `/convex/auth.ts`, create your configuration object:

```typescript
import type { ConvexBetterAuthConfig } from '@convex-better-auth/package/server'

const authPackageConfig: ConvexBetterAuthConfig = {
  email: {
    from: 'Your App <noreply@example.com>',
  },
  password: {
    minLength: 8,
    maxLength: 128,
    // Add your password requirements
  },
  emailVerification: {
    required: false, // Change to true if you want to require verification
    resendEnabled: true,
  },
  socialProviders: {
    // Add your OAuth providers
  },
  site: {
    url: process.env.SITE_URL!,
  },
  branding: {
    name: 'Your App',
    tagline: 'Your tagline',
  },
  hooks: {
    // Move your onCreate, onUpdate, onDelete logic here
  },
}
```

### Step 3: Update Server Code

Replace your `/convex/auth.ts` with package imports:

**Before:**

```typescript
import { betterAuth } from 'better-auth/minimal'
import { createClient } from '@convex-dev/better-auth'
import { sendEmailVerification, sendResetPassword } from './email'
// ... lots of setup code
```

**After:**

```typescript
import {
  createAuthComponent,
  createAuth,
  createAuthQueries,
  betterAuthSchema,
} from '@convex-better-auth/package/server'

export const authComponent = createAuthComponent(
  components,
  internal,
  authConfig,
  authPackageConfig,
  betterAuthSchema
)

export const createAuthInstance = (ctx) =>
  createAuth(ctx, authComponent, authPackageConfig, authConfig, components)

const queries = createAuthQueries(authComponent)
export const { safeGetUser, getUser } = queries
```

### Step 4: Update Client Code

Update `/src/lib/auth-client.tsx`:

**Before:**

```typescript
import { createAuthClient } from 'better-auth/react'
import { twoFactorClient, magicLinkClient } from 'better-auth/client/plugins'
// ... manual setup
```

**After:**

```typescript
export { authClient } from '@convex-better-auth/package/client'
```

### Step 5: Update Component Imports

Update all route files that import auth components:

**Before:**

```typescript
import SignIn from '@/components/SignIn'
import SignUp from '@/components/SignUp'
import Settings from '@/components/Settings'
```

**After:**

```typescript
import { SignIn, SignUp, Settings } from '@convex-better-auth/package/client'
```

### Step 6: Remove Old Files

After confirming everything works, remove these old files:

```bash
# Server-side (Convex)
rm convex/email.tsx
rm -r convex/emails

# Client-side (src)
rm src/components/SignIn.tsx
rm src/components/SignUp.tsx
rm src/components/ResetPassword.tsx
rm src/components/EnableTwoFactor.tsx
rm src/components/Settings.tsx

# Note: Don't remove these yet - they're needed by the package:
# - convex/betterAuth/ (schema)
# - convex/auth.config.ts
```

### Step 7: Test Everything

Test all authentication flows:

- ✅ Sign up with email/password
- ✅ Sign in with email/password
- ✅ Sign out
- ✅ Password reset
- ✅ Email verification (if enabled)
- ✅ Change password (new feature!)
- ✅ Social OAuth
- ✅ Magic link
- ✅ Email OTP
- ✅ 2FA
- ✅ Account deletion

### Step 8: Configure New Features

Take advantage of new features:

#### 1. Password Requirements

Configure stricter password requirements:

```typescript
password: {
  minLength: 10,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
}
```

These will be enforced in:
- Sign up form
- Change password form
- Password reset form

#### 2. Email Verification

Enable required email verification:

```typescript
emailVerification: {
  required: true,  // Users must verify before signing in
  resendEnabled: true,
  resendCooldownSeconds: 60,
}
```

#### 3. Change Password

The Settings page now includes a "Change Password" button that:
- Validates against your password requirements
- Shows password strength
- Optionally revokes other sessions

#### 4. Resend Verification

Users can now resend verification emails with automatic cooldown protection.

## Troubleshooting

### Import Errors

If you see import errors for `@convex-better-auth/package`:

1. Make sure you ran `npm install` or `pnpm install`
2. Restart your TypeScript server
3. Check that `packages/convex-better-auth` exists

### Type Errors

If you see type errors in the package:

1. Make sure TypeScript can find the package's `tsconfig.json`
2. Check that your root `tsconfig.json` has the workspace reference
3. Restart your IDE

### Missing UI Components

The package uses shadcn/ui components. Make sure you have:

- `@/components/ui/button`
- `@/components/ui/card`
- `@/components/ui/input`
- `@/components/ui/label`
- `@/components/ui/checkbox`
- `@/components/ui/badge`

If missing, install them:

```bash
npx shadcn-ui@latest add button card input label checkbox badge
```

### Email Not Sending

Make sure you have:

1. `RESEND_API_KEY` in your environment variables
2. Resend component configured in Convex
3. Verified sender domain in Resend

## Rollback

If you need to rollback:

1. Restore your old `/convex/auth.ts` from git
2. Restore your old `/src/lib/auth-client.tsx`
3. Restore component imports in routes
4. Restore old component files

```bash
git checkout HEAD -- convex/auth.ts src/lib/auth-client.tsx
git checkout HEAD -- src/routes/
```

## Benefits After Migration

After migration, you'll have:

✅ Centralized auth configuration
✅ Reusable across projects
✅ Easy to update via git submodule
✅ New features (change password, enhanced verification)
✅ Type-safe configuration
✅ Better organized code
✅ Cleaner main application
✅ Password requirements validation
✅ Session revocation options

## Next Steps

1. Consider converting to a git submodule for reuse across projects
2. Customize email templates for your brand
3. Add custom password validation logic if needed
4. Extend with additional auth providers
5. Add custom user fields via hooks

## Support

For issues or questions:
- Check the README.md in the package
- Review the Better Auth documentation
- Check Convex documentation
- File an issue in your project repository
