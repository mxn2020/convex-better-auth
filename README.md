# Convex Better Auth Package

A production-ready authentication package combining [Better Auth](https://better-auth.com) with [Convex](https://convex.dev), designed as a reusable git submodule for your projects.

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
✅ **Full TypeScript Support**

## Architecture Overview

This package follows a **client + shared** architecture:

- **Client Components** (`/src/client/`) - Importable React components for your app
- **Shared Config/Types** (`/src/shared/`) - Configuration interfaces, constants, and types to copy to your Convex backend
- **Base Components** (`/src/client/components/base/`) - Reusable UI primitives (PasswordInput, SocialButtons, etc.)
- **Form Components** (`/src/client/components/forms/`) - Complete auth flows (SignIn, SignUp, Settings, etc.)

**Server-side code** must live in your Convex backend (`/convex/`) because it requires Convex context and database access.

## Installation

This package is designed to work as a git submodule in your monorepo.

### Add as Git Submodule

```bash
# In your project root
git submodule add <repo-url> packages/convex-better-auth
git submodule update --init --recursive
```

### Install Required Peer Dependencies

This package requires several peer dependencies that must be installed in your consuming project:

#### For React Projects

```bash
pnpm add react-hook-form @hookform/resolvers zod lucide-react
```

#### For SolidJS Projects

```bash
pnpm add lucide-solid solid-qr-code solid-sonner
```

#### UI Components

This package depends on `@tanstack-app/ui` which provides shadcn/ui-style components (Button, Input, Card, etc.). You have two options:

1. **Use your own UI components**: Replace imports from `@tanstack-app/ui` with your own UI library
2. **Copy the UI package**: If using the full monorepo, the UI package is already available at `packages/ui`

## Setup Guide

### Step 1: Copy Shared Files to Convex Backend

Copy the configuration files from the submodule to your Convex backend:

```bash
# Create auth directory
mkdir -p convex/auth

# Copy shared files
cp packages/convex-better-auth/src/shared/config.ts convex/auth/
cp packages/convex-better-auth/src/shared/constants.ts convex/auth/
cp packages/convex-better-auth/src/shared/types.ts convex/auth/
```

### Step 2: Configure Your Auth in Convex Backend

Update `/convex/auth.ts` to use the config:

```typescript
import { type ConvexBetterAuthConfig, mergeConfig } from './auth/config'
import {
  EMAIL_SUBJECT_VERIFICATION,
  EMAIL_SUBJECT_PASSWORD_RESET,
  EMAIL_SUBJECT_MAGIC_LINK,
  EMAIL_SUBJECT_OTP,
} from './auth/constants'

// Define your auth configuration
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

// Use config in createAuthOptions
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => ({
  baseURL: config.site.url,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: config.emailVerification.required,
    minPasswordLength: config.password.minLength,
    maxPasswordLength: config.password.maxLength,
  },
  // ... rest of your auth options
})
```

### Step 3: Import Client Components

In your React app, import components from the package:

```typescript
// Import form components
import { SignIn, SignUp, Settings, ChangePassword } from '@convex-better-auth/package/react/client'

// Or import from specific paths
import { SignIn } from '@convex-better-auth/package/react/client/forms'
import { PasswordInput, SocialButtons } from '@convex-better-auth/package/react/client/base'

// Import auth client
import { authClient } from '@convex-better-auth/package/react/client'
```

## Component Usage

### Base Components (Reusable Primitives)

Base components are low-level, reusable UI elements:

#### PasswordInput

```typescript
import { PasswordInput } from '@convex-better-auth/package/react/client/base'

<PasswordInput
  id="password"
  label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter password"
  required
/>
```

#### SocialButtons

```typescript
import { SocialButtons } from '@convex-better-auth/package/react/client/base'

<SocialButtons
  onGithubClick={handleGithubSignIn}
  onGoogleClick={handleGoogleSignIn}
  disabled={loading}
/>
```

#### OTPInput

```typescript
import { OTPInput } from '@convex-better-auth/package/react/client/base'

<OTPInput
  id="otp"
  label="Verification Code"
  value={otp}
  onChange={(e) => setOtp(e.target.value)}
  maxLength={6}
/>
```

### Form Components (Complete Flows)

Form components are complete, ready-to-use authentication flows:

#### SignIn

Multi-method sign-in with email/password, magic link, OTP, social, and anonymous options:

```typescript
import { SignIn } from '@convex-better-auth/package/react/client'

export default function SignInPage() {
  return <SignIn />
}
```

#### SignUp

User registration with email verification support:

```typescript
import { SignUp } from '@convex-better-auth/package/react/client'

export default function SignUpPage() {
  return <SignUp />
}
```

#### Settings

Comprehensive account settings page:

```typescript
import { Settings } from '@convex-better-auth/package/react/client'

export default function SettingsPage() {
  return (
    <Settings
      passwordRequirements={{
        minLength: 10,
        maxLength: 128,
        requireUppercase: true,
        requireNumbers: true,
      }}
      showChangePassword={true}
      showEmailVerification={true}
      showTwoFactor={true}
      showAccountDeletion={true}
    />
  )
}
```

#### ChangePassword

```typescript
import { ChangePassword } from '@convex-better-auth/package/react/client'

<ChangePassword
  passwordRequirements={{
    minLength: 10,
    requireUppercase: true,
  }}
  showRevokeSessionsOption={true}
  onSuccess={() => console.log('Password changed!')}
/>
```

## Configuration Reference

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

## Auth Client API

The `authClient` provides all Better Auth methods:

```typescript
import { authClient } from '@convex-better-auth/package/react/client'

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

// Get session
const { data: session } = authClient.useSession()
```

## Environment Variables

Required:

```env
SITE_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=Your App <noreply@example.com>
```

Optional (for social auth):

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## TypeScript Support

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

## Updating the Submodule

To get the latest updates:

```bash
cd packages/convex-better-auth
git pull origin main
cd ../..
git add packages/convex-better-auth
git commit -m "Update auth package"
```

## Package Structure

```
convex-better-auth/
├── src/
│   ├── client/              # Importable React components
│   │   ├── components/
│   │   │   ├── base/       # Reusable UI primitives
│   │   │   └── forms/      # Complete auth flows
│   │   ├── auth-client.ts  # Better Auth client instance
│   │   └── index.ts
│   ├── shared/              # Copy to your convex backend
│   │   ├── config.ts       # Configuration interfaces
│   │   ├── constants.ts    # Shared constants
│   │   └── types.ts        # Type definitions
│   └── index.ts             # Main exports
├── package.json
└── README.md
```

## License

MIT

## Credits

- [Better Auth](https://better-auth.com) - Authentication framework
- [Convex](https://convex.dev) - Backend platform
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [React Email](https://react.email) - Email templates
