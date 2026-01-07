# Convex Better Auth - SolidJS

Complete SolidJS port of the Convex Better Auth package, providing authentication hooks and components for SolidJS applications.

## ✅ Port Status: COMPLETE

All core functionality has been ported from React to SolidJS with 1:1 feature parity.

### Completed Components

#### Infrastructure (100%)
- ✅ Auth Client (using `better-auth/solid`)
- ✅ Configuration system (types, defaults, merge)
- ✅ AuthConfigProvider (Context + hook)
- ✅ Validation utilities
- ✅ Error handling utilities

#### Base Components (100% - 7/7)
- ✅ FormField
- ✅ LoadingButton
- ✅ MethodToggle
- ✅ PasswordInput
- ✅ OTPInput
- ✅ SocialButtons
- ✅ AuthCard

#### Hooks (100% - 15/15)

**Utility Hooks (3/3)**
- ✅ useAuthConfig
- ✅ useAuthMethod
- ✅ useAuthError

**Core Auth Hooks (6/6)**
- ✅ useSignIn
- ✅ useSignUp
- ✅ useSocialAuth
- ✅ useMagicLink
- ✅ useOTPAuth
- ✅ useAnonymousAuth

**Password Hooks (3/3)**
- ✅ usePasswordReset
- ✅ usePasswordChange
- ✅ usePasswordValidation

**Two-Factor Hooks (2/2)**
- ✅ useTwoFactorEnable
- ✅ useTwoFactorDisable

**Verification Hooks (1/1)**
- ✅ useResendVerification

#### Other Components (2/2)
- ✅ SignOutButton
- ✅ UserProfile

## Usage

### Installation

This package is part of the monorepo and uses SolidJS instead of React.

```bash
pnpm add solid-js @tanstack/solid-router
```

### Setup Auth Client

```tsx
// src/library/auth-client.ts
import { createAuthClient } from 'better-auth/solid'
import {
  twoFactorClient,
  magicLinkClient,
  emailOTPClient,
  anonymousClient,
} from 'better-auth/client/plugins'
import { convexClient } from '@convex-dev/better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    emailOTPClient(),
    twoFactorClient(),
    anonymousClient(),
    convexClient(),
  ],
})
```

### Use Auth Hooks

```tsx
import { useSignIn, useSignUp } from '@convex-better-auth/solid/client'
import { createSignal } from 'solid-js'

function SignInForm() {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')

  const { signInWithPassword, isLoading, error } = useSignIn({
    onSuccess: () => console.log('Signed in!'),
  })

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    await signInWithPassword(email(), password())
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email()}
        onInput={(e) => setEmail(e.currentTarget.value)}
      />
      <input
        type="password"
        value={password()}
        onInput={(e) => setPassword(e.currentTarget.value)}
      />
      <button type="submit" disabled={isLoading()}>
        Sign In
      </button>
      <Show when={error()}>
        <p>{error()!.message}</p>
      </Show>
    </form>
  )
}
```

### Use Base Components

```tsx
import { FormField, LoadingButton } from '@convex-better-auth/solid/client/base'
import { createSignal } from 'solid-js'

function MyForm() {
  const [email, setEmail] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  return (
    <form>
      <FormField
        label="Email"
        type="email"
        value={email()}
        onInput={(e) => setEmail(e.currentTarget.value)}
      />
      <LoadingButton isLoading={loading()}>
        Submit
      </LoadingButton>
    </form>
  )
}
```

### Use Auth Config Provider

```tsx
import { AuthConfigProvider } from '@convex-better-auth/solid/client'

function App() {
  return (
    <AuthConfigProvider config={{
      features: {
        enabledAuthMethods: ['password', 'github'],
        defaultSignInMethod: 'password',
      },
      navigation: {
        afterSignIn: '/dashboard',
      },
    }}>
      <YourApp />
    </AuthConfigProvider>
  )
}
```

## Key Differences from React

### Reactivity
- `useState` → `createSignal`
- `useMemo` → `createMemo`
- `useCallback` → not needed (functions are stable in SolidJS)
- `useEffect` → `createEffect`

### JSX
- `className` → `class`
- `&&` conditionals → `<Show>` component
- Event handlers use native DOM events (not synthetic)
- Use `onInput` instead of `onChange` for inputs

### Hooks Return Values
In SolidJS, signals are functions that must be called to access their value:

```tsx
// React
const [count, setCount] = useState(0)
console.log(count) // 0

// SolidJS
const [count, setCount] = createSignal(0)
console.log(count()) // 0 - must call the signal
```

## File Structure

```
src/solid/
├── index.ts                    # Main entry point
├── client/
│   ├── index.ts               # Client exports
│   ├── auth-client.ts         # Auth client setup
│   ├── config/                # Configuration
│   ├── providers/             # Context providers
│   ├── hooks/                 # All hooks
│   │   ├── core/             # Auth hooks
│   │   ├── password/         # Password management
│   │   ├── twoFactor/        # 2FA hooks
│   │   ├── verification/     # Email verification
│   │   └── utils/            # Utility hooks
│   ├── components/
│   │   ├── base/             # Base UI components
│   │   ├── forms/            # Form components
│   │   ├── SignOutButton.tsx
│   │   └── UserProfile.tsx
│   └── utils/                # Utilities
```

## Export Paths

- `@convex-better-auth/solid` - Main exports
- `@convex-better-auth/solid/client` - All client-side exports
- `@convex-better-auth/solid/client/base` - Base components only
- `@convex-better-auth/solid/client/forms` - Form components only

## Testing

All hooks and components follow the same patterns as the React version, so testing strategies remain similar. Use SolidJS testing libraries like `@solidjs/testing-library` for component tests.

## See Also

- [PORTING-GUIDE.md](./PORTING-GUIDE.md) - Detailed porting guide from React to SolidJS
- [React Version](./src/react/) - Original React implementation
