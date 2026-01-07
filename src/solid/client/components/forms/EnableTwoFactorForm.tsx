// packages/convex-better-auth/src/solid/client/components/forms/EnableTwoFactorForm.tsx

/**
 * Enable two-factor authentication form logic component for Solid
 * Handles multi-step 2FA setup process
 * Layout is handled by parent component
 */

import { Button } from '@tanstack-app/ui/solid'
import Check from 'lucide-solid/icons/check'
import Copy from 'lucide-solid/icons/copy'
import { createSignal, Show, type Component } from 'solid-js'
import { QRCodeSVG } from 'solid-qr-code'
import { createTwoFactorEnable } from '../../composables/twoFactor/createTwoFactorEnable'
import { FormField, LoadingButton } from '../base'

export interface EnableTwoFactorFormProps {
  /** Callback when user clicks back button */
  onBack?: () => void

  /** Callback when 2FA is successfully enabled */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void
}

/**
 * Enable two-factor authentication form with all logic
 * This component only handles the multi-step form and 2FA operations
 * Multi-step wizard: password → QR code → verify → backup codes
 *
 * @example
 * ```tsx
 * <EnableTwoFactorForm
 *   onBack={() => navigate('/settings')}
 *   onSuccess={() => console.log('2FA enabled!')}
 * />
 * ```
 */
export const EnableTwoFactorForm: Component<EnableTwoFactorFormProps> = (props) => {
  const {
    enableTwoFactor,
    verifySetup,
    totpUri,
    backupCodes,
    step,
    isLoading,
  } = createTwoFactorEnable({
    onSuccess: props.onSuccess,
    onError: props.onError,
  })

  const [copied, setCopied] = createSignal(false)
  const [password, setPassword] = createSignal('')
  const [code, setCode] = createSignal('')
  const [errors, setErrors] = createSignal<{
    password?: string
    code?: string
  }>({})

  // Auth handlers
  const onPasswordSubmit = async (e: Event) => {
    e.preventDefault()

    if (!password()) {
      setErrors({ password: 'Password is required' })
      return
    }

    setErrors({})
    await enableTwoFactor(password())
  }

  const onVerifySubmit = async (e: Event) => {
    e.preventDefault()

    if (!code()) {
      setErrors({ code: 'Verification code is required' })
      return
    }

    setErrors({})
    await verifySetup(code())
  }

  const copyBackupCodes = async () => {
    if (!backupCodes()) return
    await navigator.clipboard.writeText(backupCodes()!.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDone = () => {
    if (props.onBack) {
      props.onBack()
    } else {
      window.location.reload()
    }
  }

  return (
    <div class="grid gap-4">
      {/* Step Indicator */}
      <div class="text-xs text-muted-foreground">
        <Show
          when={step() === 'password'}
          fallback={
            <Show
              when={step() === 'qr-verify'}
              fallback="Step 3 of 3: Save your backup codes"
            >
              Step 2 of 3: Scan QR code and verify
            </Show>
          }
        >
          Step 1 of 3: Verify your password
        </Show>
      </div>

      {/* Step 1: Password Verification */}
      <Show when={step() === 'password'}>
        <form onSubmit={onPasswordSubmit} class="grid gap-4">
          <p class="text-sm text-muted-foreground">
            Enter your password to begin the two-factor authentication setup
            process.
          </p>

          <FormField
            label="Password"
            type="password"
            placeholder="Enter your password"
            disabled={isLoading()}
            value={password()}
            onInput={(e: InputEvent) => setPassword((e.target as HTMLInputElement).value)}
            error={errors().password}
          />

          <LoadingButton
            type="submit"
            class="w-full"
            isLoading={isLoading()}
            loadingText="Verifying..."
          >
            Continue
          </LoadingButton>
        </form>
      </Show>

      {/* Step 2: QR Code + Verify */}
      <Show when={step() === 'qr-verify' && totpUri()}>
        <div class="grid gap-6">
          {/* QR Code Display */}
          <div class="flex justify-center p-4 bg-white rounded-lg">
            <QRCodeSVG
              value={totpUri()!}
              width={200}
              height={200}
              level="medium"
              backgroundColor="#ffffff"
              backgroundAlpha={1}
              foregroundColor="#000000"
              foregroundAlpha={1}
            />
          </div>

          {/* Instructions */}
          <div class="text-xs text-muted-foreground space-y-2">
            <p>1. Open your authenticator app (Google Authenticator, Authy, etc.)</p>
            <p>2. Scan the QR code above</p>
            <p>3. Enter the 6-digit code from your app below</p>
          </div>

          {/* Verification Form */}
          <form onSubmit={onVerifySubmit} class="grid gap-4">
            <FormField
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit code"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={6}
              disabled={isLoading()}
              value={code()}
              onInput={(e: InputEvent) => setCode((e.target as HTMLInputElement).value)}
              error={errors().code}
            />

            <LoadingButton
              type="submit"
              class="w-full"
              isLoading={isLoading()}
              loadingText="Verifying..."
            >
              Verify & Enable
            </LoadingButton>
          </form>
        </div>
      </Show>

      {/* Step 3: Backup Codes */}
      <Show when={step() === 'backup-codes' && backupCodes()}>
        <div class="grid gap-4">
          {/* Warning Message */}
          <div class="text-sm text-muted-foreground space-y-2">
            <p class="font-medium text-foreground">Important!</p>
            <p>
              Save these backup codes in a secure place. You can use them to
              access your account if you lose access to your authenticator app.
            </p>
            <p class="text-xs text-amber-600 dark:text-amber-500">
              These codes will only be shown once!
            </p>
          </div>

          {/* Backup Codes Display */}
          <div class="relative p-4 bg-muted rounded-lg">
            <pre class="text-sm font-mono whitespace-pre-line">
              {backupCodes()!.join('\n')}
            </pre>
            <Button
              variant="ghost"
              size="icon"
              class="absolute top-2 right-2"
              onClick={copyBackupCodes}
              type="button"
            >
              <Show when={copied()} fallback={<Copy size={16} />}>
                <Check size={16} />
              </Show>
            </Button>
          </div>

          {/* Copy Confirmation */}
          <Show when={copied()}>
            <p class="text-xs text-green-600 dark:text-green-500 text-center">
              Backup codes copied to clipboard!
            </p>
          </Show>

          {/* Done Button */}
          <Button onClick={handleDone} class="w-full">
            Done
          </Button>
        </div>
      </Show>
    </div>
  )
}

export default EnableTwoFactorForm
