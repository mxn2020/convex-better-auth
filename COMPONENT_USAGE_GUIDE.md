# Component Usage Guide

## Page Components vs Form Components

The package provides **two types of components** for maximum flexibility:

### 🔷 Page Components (for TanStack Router)

Use these in your route files:
- `SignIn`
- `SignUp`
- `ResetPassword`
- `Settings`
- `EnableTwoFactor`

**When to use:** When you're using TanStack Router and want drop-in page components.

**Example:**
```tsx
// routes/sign-in.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn } from '@convex-better-auth/client'

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
})
```

### 🔶 Form Components (for custom UIs)

Use these when you want more control:
- `SignInForm`
- `SignUpForm`
- `ResetPasswordForm`
- `ChangePasswordForm`
- `EnableTwoFactorForm`
- `ResendVerificationForm`
- `SettingsPage`

**When to use:**
- Building custom page layouts
- Composing multiple forms
- Adding custom wrappers
- Server-side rendering

**Example:**
```tsx
// app/sign-in/page.tsx
'use client'  // For Next.js App Router

import { SignInForm } from '@convex-better-auth/client'

export default function SignInPage() {
  return (
    <div className="custom-layout">
      <header>My Custom Header</header>
      <SignInForm />
      <footer>My Custom Footer</footer>
    </div>
  )
}
```

---

## Usage Examples

### 1. TanStack Router (Recommended)

```tsx
// routes/sign-in.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn } from '@convex-better-auth/client'

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
})

// routes/sign-up.tsx
import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@convex-better-auth/client'

export const Route = createFileRoute('/sign-up')({
  component: SignUp,
})

// routes/settings.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Settings } from '@convex-better-auth/client'

export const Route = createFileRoute('/settings')({
  component: Settings,
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/sign-in' })
    }
  },
})
```

### 2. Next.js App Router (Client Components)

```tsx
// app/sign-in/page.tsx
'use client'

import { SignInForm } from '@convex-better-auth/client'

export default function SignInPage() {
  return <SignInForm />
}

// app/settings/page.tsx
'use client'

import { SettingsPage } from '@convex-better-auth/client'

export default function Settings() {
  return <SettingsPage backLink="/dashboard" />
}
```

### 3. Custom Layouts

```tsx
'use client'

import { SignInForm } from '@convex-better-auth/client'

export default function CustomSignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <nav className="p-4">
        <Logo />
      </nav>
      <main>
        <SignInForm />
      </main>
      <footer className="text-center p-4">
        © 2026 My Company
      </footer>
    </div>
  )
}
```

### 4. Composing Multiple Forms

```tsx
'use client'

import {
  ChangePasswordForm,
  EnableTwoFactorForm,
  ResendVerificationForm
} from '@convex-better-auth/client'

export default function SecuritySettings() {
  const [activeTab, setActiveTab] = useState('password')

  return (
    <div className="container mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="2fa">Two-Factor</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <ChangePasswordForm showCard={false} />
        </TabsContent>

        <TabsContent value="2fa">
          <EnableTwoFactorForm />
        </TabsContent>

        <TabsContent value="email">
          <ResendVerificationForm email={user.email} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## Component Structure

```
Page Component (SignIn.tsx)
    │
    └─> Form Component (SignInForm.tsx)
            │
            ├─> Hooks (useSignIn, useMagicLink, etc.)
            │   └─> Business Logic
            │
            └─> Base Components (FormField, LoadingButton)
                └─> UI Primitives
```

---

## Which Should You Use?

| Scenario | Use |
|----------|-----|
| TanStack Router routes | **Page Components** (SignIn, SignUp, etc.) |
| Next.js App Router | **Form Components** (SignInForm, etc.) |
| Custom page layouts | **Form Components** |
| Composition | **Form Components** |
| Quick setup | **Page Components** |
| Maximum control | **Form Components** |

---

## Import Patterns

### Page Components
```tsx
import { SignIn, SignUp, Settings } from '@convex-better-auth/client'
```

### Form Components
```tsx
import {
  SignInForm,
  SignUpForm,
  SettingsPage
} from '@convex-better-auth/client'
```

### Hooks (for completely custom UIs)
```tsx
import {
  useSignIn,
  useSignUp,
  useAuthConfig
} from '@convex-better-auth/client/hooks'
```

---

## Pro Tips

1. **Use Page Components** when you want the simplest setup with TanStack Router
2. **Use Form Components** when you need custom layouts or SSR
3. **Use Hooks** when you want to build completely custom UIs
4. **Mix and match** - use Form Components in some routes, Page Components in others
5. **Wrap with providers** - all components need `<AuthConfigProvider>` at the app level

---

## Complete Example

```tsx
// app/layout.tsx
import { AuthConfigProvider } from '@convex-better-auth/client'

export default function RootLayout({ children }) {
  return (
    <AuthConfigProvider
      config={{
        features: {
          enabledAuthMethods: ['password', 'github'],
        },
        navigation: {
          afterSignIn: '/dashboard',
        },
      }}
    >
      {children}
    </AuthConfigProvider>
  )
}

// routes/sign-in.tsx (TanStack Router)
import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@convex-better-auth/client'

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
})

// OR app/sign-in/page.tsx (Next.js)
'use client'
import { SignInForm } from '@convex-better-auth/client'

export default function Page() {
  return <SignInForm />
}
```

---

**Summary:** Page Components are thin wrappers around Form Components, designed for easy integration with routing systems. Use Page Components for quick setup, Form Components for custom layouts.
