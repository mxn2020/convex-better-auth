// packages/convex-better-auth/src/client/components/forms/EnableTwoFactorForm.tsx

/**
 * Enable two-factor authentication form logic component
 * Handles multi-step 2FA setup process
 * Layout is handled by parent component
 */

import { Button } from '@tanstack-app/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import QRCode from 'react-qr-code'
import { useTwoFactorEnable } from '../../hooks/twoFactor/useTwoFactorEnable'
import {
  twoFactorPasswordSchema,
  twoFactorVerifySchema,
  type TwoFactorPasswordFormData,
  type TwoFactorVerifyFormData,
} from '../../utils/validation'
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
export default function EnableTwoFactorForm({
  onBack,
  onSuccess,
  onError,
}: EnableTwoFactorFormProps) {
  const {
    enableTwoFactor,
    verifySetup,
    totpUri,
    backupCodes,
    step,
    isLoading,
  } = useTwoFactorEnable({
    onSuccess,
    onError,
  })

  const [copied, setCopied] = useState(false)

  const passwordForm = useForm<TwoFactorPasswordFormData>({
    resolver: zodResolver(twoFactorPasswordSchema),
    defaultValues: {
      password: '',
    },
  })

  const verifyForm = useForm<TwoFactorVerifyFormData>({
    resolver: zodResolver(twoFactorVerifySchema),
    defaultValues: {
      code: '',
    },
  })

  // Auth handlers
  const onPasswordSubmit = passwordForm.handleSubmit(async (data) => {
    await enableTwoFactor(data.password)
  })

  const onVerifySubmit = verifyForm.handleSubmit(async (data) => {
    await verifySetup(data.code)
  })

  const copyBackupCodes = async () => {
    if (!backupCodes) return
    await navigator.clipboard.writeText(backupCodes.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDone = () => {
    if (onBack) {
      onBack()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="grid gap-4">
      {/* Step Indicator */}
      <div className="text-xs text-muted-foreground">
        {step === 'password'
          ? 'Step 1 of 3: Verify your password'
          : step === 'qr-verify'
            ? 'Step 2 of 3: Scan QR code and verify'
            : 'Step 3 of 3: Save your backup codes'}
      </div>

      {/* Step 1: Password Verification */}
      {step === 'password' && (
        <form onSubmit={onPasswordSubmit} className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Enter your password to begin the two-factor authentication setup
            process.
          </p>

          <FormField
            label="Password"
            type="password"
            placeholder="Enter your password"
            disabled={isLoading}
            {...passwordForm.register('password')}
            error={passwordForm.formState.errors.password?.message}
          />

          <LoadingButton
            type="submit"
            className="w-full"
            isLoading={isLoading}
            loadingText="Verifying..."
          >
            Continue
          </LoadingButton>
        </form>
      )}

      {/* Step 2: QR Code + Verify */}
      {step === 'qr-verify' && totpUri && (
        <div className="grid gap-6">
          {/* QR Code Display */}
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <QRCode value={totpUri} size={200} />
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-2">
            <p>1. Open your authenticator app (Google Authenticator, Authy, etc.)</p>
            <p>2. Scan the QR code above</p>
            <p>3. Enter the 6-digit code from your app below</p>
          </div>

          {/* Verification Form */}
          <form onSubmit={onVerifySubmit} className="grid gap-4">
            <FormField
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit code"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={6}
              disabled={isLoading}
              {...verifyForm.register('code')}
              error={verifyForm.formState.errors.code?.message}
            />

            <LoadingButton
              type="submit"
              className="w-full"
              isLoading={isLoading}
              loadingText="Verifying..."
            >
              Verify & Enable
            </LoadingButton>
          </form>
        </div>
      )}

      {/* Step 3: Backup Codes */}
      {step === 'backup-codes' && backupCodes && (
        <div className="grid gap-4">
          {/* Warning Message */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Important!</p>
            <p>
              Save these backup codes in a secure place. You can use them to
              access your account if you lose access to your authenticator app.
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500">
              These codes will only be shown once!
            </p>
          </div>

          {/* Backup Codes Display */}
          <div className="relative p-4 bg-muted rounded-lg">
            <pre className="text-sm font-mono whitespace-pre-line">
              {backupCodes.join('\n')}
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={copyBackupCodes}
              type="button"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>

          {/* Copy Confirmation */}
          {copied && (
            <p className="text-xs text-green-600 dark:text-green-500 text-center">
              Backup codes copied to clipboard!
            </p>
          )}

          {/* Done Button */}
          <Button onClick={handleDone} className="w-full">
            Done
          </Button>
        </div>
      )}
    </div>
  )
}
