# Migration Guide

This guide helps you migrate an existing Convex + Better Auth project to use this refactored package.

## Overview

The package now follows a **client + shared** architecture:
- **Client components**: Import from the package (reusable)
- **Shared config/types**: Copy to your Convex backend (customizable)
- **Server code**: Lives in your Convex backend (not in the package)

## Migration Steps

### Step 1: Copy Shared Files to Convex Backend

The shared configuration files need to be copied to your Convex backend:

```bash
# Create auth directory
mkdir -p convex/auth

# Copy shared files from the package
cp packages/convex-better-auth/src/shared/config.ts convex/auth/
cp packages/convex-better-auth/src/shared/constants.ts convex/auth/
cp packages/convex-better-auth/src/shared/types.ts convex/auth/
```

These files provide:
- `config.ts` - Configuration interfaces and validation utilities
- `constants.ts` - Email subjects, error messages, and shared constants
- `types.ts` - Type definitions for auth providers, status, etc.

### Step 2: Update Convex Backend to Use Config

Update `/convex/auth.ts` to import and use the config:

**Before:**
```typescript
// Hardcoded values
requireEmailVerification: false,
minPasswordLength: undefined,
from: 'Test <onboarding@example.com>',
subject: 'Verify your email address',
```

**After:**
```typescript
import { type ConvexBetterAuthConfig, mergeConfig } from './auth/config'
import {
  EMAIL_SUBJECT_VERIFICATION,
  EMAIL_SUBJECT_PASSWORD_RESET,
  EMAIL_SUBJECT_MAGIC_LINK,
  EMAIL_SUBJECT_OTP,
} from './auth/constants'

// Create configuration object
const betterAuthConfig: ConvexBetterAuthConfig = {
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
    required: false,
    resendEnabled: true,
    resendCooldownSeconds: 60,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  site: {
    url: process.env.SITE_URL!,
  },
  branding: {
    name: 'Your App',
    tagline: 'Simple, secure authentication',
  },
}

const config = mergeConfig(betterAuthConfig)

// Use config values in createAuthOptions
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => ({
  baseURL: config.site.url,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: config.emailVerification.required,
    minPasswordLength: config.password.minLength,
    maxPasswordLength: config.password.maxLength,
  },
  socialProviders: config.socialProviders,
  // ... rest of options
})
```

### Step 3: Update Email Functions

Update `/convex/email.tsx` to use constants:

**Before:**
```typescript
subject: 'Verify your email address',
from: 'Test <onboarding@example.com>',
```

**After:**
```typescript
import {
  EMAIL_SUBJECT_VERIFICATION,
  EMAIL_SUBJECT_PASSWORD_RESET,
  EMAIL_SUBJECT_MAGIC_LINK,
  EMAIL_SUBJECT_OTP,
} from './auth/constants'

const emailFrom = process.env.EMAIL_FROM || 'Your App <noreply@example.com>'

export const sendEmailVerification = async (ctx, { to, url }) => {
  await sendEmail(ctx, {
    to,
    from: emailFrom,
    subject: EMAIL_SUBJECT_VERIFICATION,
    html: await render(<VerifyEmail url={url} />),
  })
}
```

### Step 4: Update Client Component Imports

The package structure has changed - components are now organized into `base` and `forms`:

**Before:**
```typescript
import SignIn from '@/components/SignIn'
import SignUp from '@/components/SignUp'
import { ChangePassword } from '@/components/ChangePassword'
```

**After:**
```typescript
// Import from package
import { SignIn, SignUp, ChangePassword } from '@convex-better-auth/package/client'

// Or import from specific paths
import { SignIn } from '@convex-better-auth/package/client/forms'
import { PasswordInput, SocialButtons } from '@convex-better-auth/package/client/base'
```

### Step 5: Update Auth Client Import

The auth client can now be imported directly:

**Before:**
```typescript
import { createAuthClient } from 'better-auth/react'
import { magicLinkClient, emailOTPClient } from 'better-auth/client/plugins'
// ... manual setup
```

**After:**
```typescript
import { authClient } from '@convex-better-auth/package/client'
```

### Step 6: Verify Package Exports

The package now exports:
- `/client` - All client components and auth client
- `/client/base` - Base UI primitives (PasswordInput, SocialButtons, OTPInput, AuthCard)
- `/client/forms` - Form components (SignIn, SignUp, Settings, etc.)
- `/shared` - Shared types and configuration interfaces

The `/server` export has been removed - server code lives in your Convex backend.

### Step 7: Environment Variables

Add the EMAIL_FROM environment variable if using constants:

```env
EMAIL_FROM=Your App <noreply@example.com>
```

Or the email will default to the value in your config.

### Step 8: Test All Flows

Test these authentication flows:

- ✅ Sign up with email/password
- ✅ Sign in with email/password
- ✅ Sign out
- ✅ Password reset
- ✅ Email verification
- ✅ Change password
- ✅ Social OAuth (GitHub, Google)
- ✅ Magic link
- ✅ Email OTP
- ✅ 2FA
- ✅ Account deletion

## New Features After Migration

### 1. Centralized Configuration

All auth settings in one place:
```typescript
const betterAuthConfig: ConvexBetterAuthConfig = {
  email: { from: '...' },
  password: { minLength: 10, requireUppercase: true },
  emailVerification: { required: true },
  // ...
}
```

### 2. Base Components

Reusable UI primitives you can compose:
```typescript
import { PasswordInput, SocialButtons, OTPInput, AuthCard } from '@convex-better-auth/package/client/base'
```

### 3. Organized Component Structure

- **Base components** (`/base/`) - Low-level primitives
- **Form components** (`/forms/`) - Complete auth flows

### 4. Shared Constants

No more hardcoded strings:
```typescript
import {
  EMAIL_SUBJECT_VERIFICATION,
  ERROR_INVALID_CREDENTIALS,
  SUCCESS_PASSWORD_CHANGED,
} from './auth/constants'
```

## Troubleshooting

### Import Errors

If you see module resolution errors:

1. Run `npm install` or `pnpm install`
2. Restart your TypeScript server
3. Check that `packages/convex-better-auth` exists
4. Verify package.json exports are correct

### Type Errors

If TypeScript can't find types:

1. Ensure shared files are copied to `convex/auth/`
2. Check import paths are correct (`'./auth/config'` not `'../auth/config'`)
3. Restart your IDE

### Component Not Found

If components can't be imported:

1. Check the new import paths (use `/client/forms` or `/client/base`)
2. Ensure you're not importing from `/server` (removed)
3. Use the correct package paths in import statements

### Missing UI Components

The package uses `@tanstack-app/ui` (shadcn/ui). Ensure you have:
- Button, Card, Input, Label, Checkbox components available

## Architecture Benefits

After migration:

✅ **Separation of Concerns**: Client (importable) vs Server (in convex)
✅ **Type-Safe Config**: Centralized configuration with TypeScript
✅ **Reusable Components**: Base components for custom flows
✅ **Maintainable**: Clear structure and organization
✅ **Git Submodule Ready**: Easy to share across projects
✅ **No Hardcoded Values**: Constants and config for all strings

## Rollback

If you need to rollback:

```bash
# Restore old auth files
git checkout HEAD -- convex/auth.ts convex/email.tsx

# Remove copied files
rm -rf convex/auth/

# Restore client imports
git checkout HEAD -- src/routes/
```

## Next Steps

1. Customize email templates with your branding
2. Adjust password requirements for your use case
3. Add custom validation logic if needed
4. Consider stricter email verification requirements
5. Extend with additional OAuth providers

## Support

For issues:
- Check the README.md in the package
- Review [Better Auth docs](https://better-auth.com)
- Review [Convex docs](https://docs.convex.dev)
