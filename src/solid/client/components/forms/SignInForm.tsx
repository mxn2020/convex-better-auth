// packages/convex-better-auth/src/solid/client/components/forms/SignInForm.tsx

/**
 * Sign in form for Solid
 * Simplified version demonstrating Solid reactivity patterns
 */

import { createSignal, Show, type Component } from 'solid-js'
import { Button, Input, Label, Card, CardHeader, CardTitle, CardContent } from '@tanstack-app/ui/solid'
import { authClient } from '~/library/auth-client'
import { useNavigate } from '@tanstack/solid-router'
import { refreshAuth } from '~/library/convex-client'

export interface SignInFormProps {
  redirectTo?: string
}

export const SignInForm: Component<SignInFormProps> = (props) => {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await authClient.signIn.email({
        email: email(),
        password: password(),
      })

      if (result.error) {
        setError(result.error.message || 'Sign in failed')
        return
      }

      // Refresh Convex auth token
      refreshAuth()

      // Navigate to dashboard or redirect URL
      navigate({ to: props.redirectTo || '/dashboard' })
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred')
      console.error('Sign in error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card class="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} class="space-y-4">
          <Show when={error()}>
            <div class="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
              {error()}
            </div>
          </Show>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="you@example.com"
              required
              disabled={loading()}
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              placeholder="••••••••"
              required
              disabled={loading()}
            />
          </div>

          <Button
            type="submit"
            class="w-full"
            loading={loading()}
            disabled={loading()}
          >
            <Show when={!loading()} fallback="Signing in...">
              Sign In
            </Show>
          </Button>

          <div class="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="/sign-up" class="text-primary hover:underline">
              Sign up
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SignInForm
