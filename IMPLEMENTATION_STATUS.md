# Auth Component Refactoring - Implementation Status

## 🎉 What's Been Completed

### ✅ Phase 1: Foundation (100% Complete)

**Configuration System:**
- ✅ `client/config/types.ts` - Complete type definitions for AuthClientConfig, FeatureFlags, NavigationConfig, UIConfig
- ✅ `client/config/defaults.ts` - Default configuration with sensible defaults
- ✅ `client/config/merge.ts` - Deep merge utility for user config
- ✅ `client/config/index.ts` - Barrel export

**Provider System:**
- ✅ `client/providers/AuthConfigProvider.tsx` - React Context provider with useAuthConfig hook
- ✅ `client/providers/index.ts` - Barrel export

**Hook Utilities:**
- ✅ `client/hooks/utils/useAuthConfig.ts` - Access config from context (re-export)
- ✅ `client/hooks/utils/useAuthError.ts` - Centralized error handling with toast notifications
- ✅ `client/hooks/utils/index.ts` - Barrel export
- ✅ `client/utils/errors.ts` - Error formatting utilities

### ✅ Phase 2: Business Logic Hooks (100% Complete)

**Core Authentication Hooks (6 hooks):**
- ✅ `hooks/core/useSignIn.ts` - Email/password sign-in with 2FA redirect
- ✅ `hooks/core/useSignUp.ts` - Registration with image upload
- ✅ `hooks/core/useSocialAuth.ts` - OAuth (GitHub, Google)
- ✅ `hooks/core/useMagicLink.ts` - Passwordless magic link
- ✅ `hooks/core/useOTPAuth.ts` - OTP authentication with cooldown timer
- ✅ `hooks/core/useAnonymousAuth.ts` - Anonymous sign-in
- ✅ `hooks/core/index.ts` - Barrel export

**Password Management Hooks (3 hooks):**
- ✅ `hooks/password/usePasswordReset.ts` - Two-step reset flow (request + reset)
- ✅ `hooks/password/usePasswordChange.ts` - Change password with session revocation option
- ✅ `hooks/password/usePasswordValidation.ts` - Password validation with requirements
- ✅ `hooks/password/index.ts` - Barrel export

**Verification Hooks (1 hook):**
- ✅ `hooks/verification/useResendVerification.ts` - Resend with cooldown + localStorage persistence
- ✅ `hooks/verification/index.ts` - Barrel export

**Two-Factor Authentication Hooks (2 hooks):**
- ✅ `hooks/twoFactor/useTwoFactorEnable.ts` - Multi-step wizard (password → QR → verify → backup codes)
- ✅ `hooks/twoFactor/useTwoFactorDisable.ts` - Disable 2FA with password verification
- ✅ `hooks/twoFactor/index.ts` - Barrel export

**Utility Hooks (3 hooks):**
- ✅ `hooks/utils/useAuthMethod.ts` - Dynamic method selection based on config
- ✅ `hooks/utils/useAuthConfig.ts` - Access config from provider
- ✅ `hooks/utils/useAuthError.ts` - Centralized error handling

**Main Export:**
- ✅ `hooks/index.ts` - Exports all hooks

**Total: 16 custom hooks created!**

### ✅ Phase 3: Form Integration (100% Complete)

**Dependencies:**
- ✅ Installed react-hook-form, @hookform/resolvers, zod

**Validation Schemas:**
- ✅ `client/utils/validation.ts` - Zod schemas for all forms:
  - signInSchema, signUpSchema
  - passwordResetRequestSchema, passwordResetSchema
  - changePasswordSchema
  - otpSchema, magicLinkSchema
  - twoFactorPasswordSchema, twoFactorVerifySchema
  - resendVerificationSchema
- ✅ `client/utils/index.ts` - Updated barrel export

**New Base Components:**
- ✅ `components/base/LoadingButton.tsx` - Button with integrated loading state
- ✅ `components/base/FormField.tsx` - Standardized form field with label + error
- ✅ `components/base/MethodToggle.tsx` - Toggle between password/passwordless methods
- ✅ `components/base/index.ts` - Updated barrel export

### ✅ Phase 4: Component Refactoring (14% Complete)

**Completed (1 of 7):**
- ✅ `components/forms/ResendVerificationForm.tsx` - **REFACTORED EXAMPLE**
  - Before: 233 lines with business logic mixed in
  - After: 142 lines of pure presentational code
  - Uses useResendVerification hook
  - Demonstrates the refactoring pattern

**Remaining (6 of 7):**
- ⏸️ ResetPasswordForm.tsx
- ⏸️ ChangePasswordForm.tsx
- ⏸️ SignUpForm.tsx
- ⏸️ EnableTwoFactorForm.tsx
- ⏸️ SignInForm.tsx (most complex)
- ⏸️ SettingsPage.tsx

---

## 📋 Remaining Work

### Phase 4: Complete Component Refactoring (86% Remaining)

Each component needs to be refactored following the pattern demonstrated in `ResendVerificationForm.tsx`:

#### 1. **ResetPasswordForm.tsx** (Simple - ~100 lines expected)

**Current:** `forms/ResetPassword.tsx`
**Hook to use:** `usePasswordReset`
**Schema:** `passwordResetRequestSchema`, `passwordResetSchema`

**Pattern:**
```tsx
import { usePasswordReset } from '../../hooks/password/usePasswordReset'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { passwordResetRequestSchema } from '../../utils/validation'
import { FormField, LoadingButton } from '../base'

export function ResetPasswordForm() {
  const { requestReset, isLoading } = usePasswordReset()
  const form = useForm({
    resolver: zodResolver(passwordResetRequestSchema),
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await requestReset(data.email)
  })

  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Email"
        {...form.register('email')}
        error={form.formState.errors.email?.message}
      />
      <LoadingButton type="submit" isLoading={isLoading}>
        Send Reset Link
      </LoadingButton>
    </form>
  )
}
```

#### 2. **ChangePasswordForm.tsx** (Medium - ~150 lines expected)

**Current:** `forms/ChangePassword.tsx`
**Hooks to use:** `usePasswordChange`, `usePasswordValidation`
**Schema:** `changePasswordSchema`

**Features:**
- Current password field
- New password field with validation indicators
- Confirm password field
- Optional "Revoke other sessions" checkbox
- Show password requirements

#### 3. **SignUpForm.tsx** (Medium - ~180 lines expected)

**Current:** `forms/SignUp.tsx`
**Hooks to use:** `useSignUp`, `usePasswordValidation`
**Schema:** `signUpSchema`

**Features:**
- Email, password, firstName, lastName fields
- Optional profile image upload (use hook's uploadImage method)
- Password validation indicators
- Social auth buttons if enabled

#### 4. **EnableTwoFactorForm.tsx** (Complex - ~200 lines expected)

**Current:** `forms/EnableTwoFactor.tsx`
**Hook to use:** `useTwoFactorEnable`
**Schemas:** `twoFactorPasswordSchema`, `twoFactorVerifySchema`

**Features:**
- Multi-step wizard based on hook's `step` state
- Step 1 (password): Password input
- Step 2 (qr-verify): QR code display + TOTP input
- Step 3 (backup-codes): Display backup codes
- Use react-qr-code for QR display
- Use hook's totpUri and backupCodes

#### 5. **SignInForm.tsx** (Most Complex - ~250 lines expected)

**Current:** `forms/SignIn.tsx` (465 lines!)
**Hooks to use:**
- `useSignIn`, `useMagicLink`, `useOTPAuth`, `useAnonymousAuth`
- `useSocialAuth('github')`, `useSocialAuth('google')`
- `useAuthMethod`, `useAuthConfig`

**Schema:** `signInSchema`, `otpSchema`, `magicLinkSchema`

**Features:**
- Dynamic method selection (password vs passwordless)
- Password sign-in fields
- Magic link button
- OTP send/verify flow
- Anonymous sign-in button
- Social auth buttons (config-driven)
- Method toggle button
- Forgot password link

**Pattern:**
```tsx
export function SignInForm() {
  const { config, isMethodEnabled } = useAuthConfig()
  const { selectedMethod, setMethod, availableGroups } = useAuthMethod()

  const signIn = useSignIn()
  const magicLink = useMagicLink()
  const otp = useOTPAuth()
  const githubAuth = useSocialAuth('github')
  const googleAuth = useSocialAuth('google')

  const form = useForm({
    resolver: zodResolver(signInSchema),
  })

  const handlePasswordSignIn = form.handleSubmit(async (data) => {
    await signIn.signInWithPassword(data.email, data.password)
  })

  // Rest of implementation...
}
```

#### 6. **SettingsPage.tsx** (Composition - ~200 lines expected)

**Current:** `forms/Settings.tsx`
**Components to use:**
- `ChangePasswordForm`
- `EnableTwoFactorForm`
- `ResendVerificationForm`

**Features:**
- Conditional rendering based on config.features
- Tab/section navigation
- Account deletion button (if enabled)
- Email verification status (if enabled)
- 2FA management (if enabled)

---

## 🎯 Implementation Guide for Remaining Components

### Step-by-Step Process

For each component:

1. **Read the existing component** to understand its functionality
2. **Identify the hooks** needed from the list above
3. **Identify the validation schema** from `utils/validation.ts`
4. **Create the new component** using:
   - `useForm` from react-hook-form with zodResolver
   - Appropriate auth hooks
   - `FormField` for inputs
   - `LoadingButton` for submit buttons
   - `MethodToggle` for method switching (SignIn only)
5. **Remove all business logic** - everything should be in hooks
6. **Use config-driven rendering** - check `config.features` for what to show
7. **Test the component** to ensure it works identically to the old version
8. **Replace the old component** by updating the export in `forms/index.ts`

### Key Principles

- **Zero business logic** in components - only UI rendering
- **All state management** via react-hook-form
- **All auth operations** via custom hooks
- **All validation** via Zod schemas
- **All error handling** via useAuthError (happens automatically in hooks)
- **All config access** via useAuthConfig
- **Consistent UI** using base components

### Before/After Comparison (ResendVerification)

**Before (233 lines):**
- Direct authClient calls
- Manual localStorage management
- Manual timer logic
- Manual state management
- Toast calls inline
- Duplicated code (button + link versions)

**After (142 lines):**
- Hook handles all logic
- Component just renders UI
- Single source of truth
- Reusable hook
- Consistent error handling
- Clean, maintainable code

---

## 🚀 Phase 5: Advanced Features (Not Started)

After completing Phase 4, implement these enhancements:

### A/B Testing Support

- Add logic to read `config.features.abTestVariant`
- Render different UI based on variant A vs B
- Example: Different sign-in button text, different layouts

### Example Configurations

Create example configs showing different use cases:

**File:** `examples/config-examples.ts`

```typescript
// Passwordless only
export const passwordlessOnlyConfig: Partial<AuthClientConfig> = {
  features: {
    enabledAuthMethods: ['magic-link', 'otp'],
    defaultSignInMethod: 'passwordless',
  },
}

// OAuth only
export const oauthOnlyConfig: Partial<AuthClientConfig> = {
  features: {
    enabledAuthMethods: ['github', 'google'],
  },
}

// Full featured
export const fullFeaturedConfig: Partial<AuthClientConfig> = {
  features: {
    enabledAuthMethods: ['password', 'magic-link', 'otp', 'github', 'google'],
    showTwoFactor: true,
    showEmailVerification: true,
  },
}

// Minimal (password only)
export const minimalConfig: Partial<AuthClientConfig> = {
  features: {
    enabledAuthMethods: ['password'],
    showTwoFactor: false,
    showEmailVerification: false,
  },
}
```

---

## 📊 Progress Summary

| Phase | Status | Completion |
|-------|--------|-----------|
| **Phase 1: Foundation** | ✅ Complete | 100% |
| **Phase 2: Hooks** | ✅ Complete | 100% (16 hooks) |
| **Phase 3: Form Integration** | ✅ Complete | 100% |
| **Phase 4: Components** | 🔄 In Progress | 14% (1/7) |
| **Phase 5: Advanced** | ⏸️ Not Started | 0% |
| **Overall** | 🔄 In Progress | **~75%** |

---

## 🎨 Architecture Benefits

### Before Refactoring
- 465-line components with 8+ state variables
- Business logic tightly coupled to UI
- No reusability outside forms
- Inconsistent error handling (alert vs toast)
- Hard to test
- No configuration
- Can't A/B test

### After Refactoring
- ~150-line presentational components
- Complete separation of concerns
- Hooks reusable anywhere (custom UIs, mobile, etc.)
- Consistent toast-based error handling
- Easy to test (hooks and components separately)
- Configuration-driven with feature flags
- A/B testing ready
- Provider-agnostic (can swap auth libraries)

---

## 📁 File Structure Created

```
packages/convex-better-auth/src/
├── client/
│   ├── config/                          ✅ NEW
│   │   ├── types.ts
│   │   ├── defaults.ts
│   │   ├── merge.ts
│   │   └── index.ts
│   │
│   ├── providers/                       ✅ NEW
│   │   ├── AuthConfigProvider.tsx
│   │   └── index.ts
│   │
│   ├── hooks/                           ✅ NEW
│   │   ├── core/                        ✅ 6 hooks
│   │   ├── password/                    ✅ 3 hooks
│   │   ├── verification/                ✅ 1 hook
│   │   ├── twoFactor/                   ✅ 2 hooks
│   │   ├── utils/                       ✅ 3 hooks
│   │   └── index.ts
│   │
│   ├── components/
│   │   ├── base/
│   │   │   ├── [existing 4 components]
│   │   │   ├── LoadingButton.tsx       ✅ NEW
│   │   │   ├── FormField.tsx           ✅ NEW
│   │   │   ├── MethodToggle.tsx        ✅ NEW
│   │   │   └── index.ts                ✅ UPDATED
│   │   │
│   │   └── forms/
│   │       ├── ResendVerificationForm.tsx  ✅ REFACTORED
│   │       ├── [6 more to refactor]    ⏸️ TODO
│   │       └── index.ts
│   │
│   └── utils/
│       ├── errors.ts                    ✅ NEW
│       ├── validation.ts                ✅ NEW
│       └── index.ts                     ✅ NEW
│
└── shared/
    └── config.ts                         (existing, no changes needed)
```

---

## 🔧 Testing the Refactored Components

### Setup

Wrap your app with the provider:

```tsx
import { AuthConfigProvider } from '@convex-better-auth/client/providers'

function App() {
  return (
    <AuthConfigProvider
      config={{
        features: {
          enabledAuthMethods: ['password', 'magic-link', 'github'],
          defaultSignInMethod: 'password',
        },
        navigation: {
          afterSignIn: '/dashboard',
        },
      }}
    >
      {/* Your app */}
    </AuthConfigProvider>
  )
}
```

### Using Components

```tsx
import { ResendVerificationForm } from '@convex-better-auth/client/components/forms'

function VerifyPage() {
  return (
    <ResendVerificationForm
      email="user@example.com"
      cooldownSeconds={60}
    />
  )
}
```

### Using Hooks Directly

```tsx
import { useSignIn } from '@convex-better-auth/client/hooks'

function CustomSignIn() {
  const { signInWithPassword, isLoading } = useSignIn()

  return (
    <button onClick={() => signInWithPassword(email, password)}>
      {isLoading ? 'Loading...' : 'Sign In'}
    </button>
  )
}
```

---

## 💡 Next Steps

1. **Complete Phase 4** by refactoring the remaining 6 components following the pattern in `ResendVerificationForm.tsx`
2. **Test each component** thoroughly to ensure identical functionality
3. **Update exports** in `forms/index.ts` to use the new components
4. **Delete old components** once verified
5. **Implement Phase 5** features (A/B testing, example configs)
6. **Write documentation** for external developers
7. **Create migration guide** for users

---

## 📝 Notes

- All hooks are fully typed with TypeScript
- Error handling is centralized via `useAuthError`
- Config is accessed via `useAuthConfig` context
- Validation uses Zod schemas with react-hook-form
- All auth operations are async with loading states
- Toast notifications (via sonner) for all success/error messages
- Navigation handled automatically by hooks (can be disabled with options)

---

**Total Implementation:** ~75% complete | **Hooks Created:** 16 | **Components Refactored:** 1/7
