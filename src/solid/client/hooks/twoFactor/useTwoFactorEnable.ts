/**
 * Hook for enabling two-factor authentication in Solid
 * Handles multi-step wizard: password → QR code → verify → backup codes
 */

import { createSignal } from 'solid-js'
import { toast } from 'solid-sonner'
import { authClient } from '../../auth-client'
import { useAuthConfig } from '../utils/useAuthConfig'
import { useAuthError } from '../utils/useAuthError'

/**
 * Steps in the 2FA enable flow
 */
export type TwoFactorStep = 'password' | 'qr-verify' | 'backup-codes'

/**
 * Options for useTwoFactorEnable hook
 */
export interface UseTwoFactorEnableOptions {
  /** Callback on successful 2FA enable */
  onSuccess?: () => void

  /** Callback on error */
  onError?: (error: Error) => void
}

/**
 * Hook for enabling two-factor authentication
 * Provides multi-step flow with QR code and backup codes
 *
 * @example
 * ```tsx
 * function EnableTwoFactorForm() {
 *   const {
 *     enableTwoFactor,
 *     verifySetup,
 *     totpUri,
 *     backupCodes,
 *     step,
 *     isLoading,
 *   } = useTwoFactorEnable()
 *
 *   return (
 *     <Switch>
 *       <Match when={step() === 'password'}>
 *         <PasswordForm onSubmit={enableTwoFactor} />
 *       </Match>
 *       <Match when={step() === 'qr-verify'}>
 *         <QRCode value={totpUri()} />
 *         <VerifyForm onSubmit={verifySetup} />
 *       </Match>
 *       <Match when={step() === 'backup-codes'}>
 *         <BackupCodesList codes={backupCodes()} />
 *       </Match>
 *     </Switch>
 *   )
 * }
 * ```
 */
export function useTwoFactorEnable(options: UseTwoFactorEnableOptions = {}) {
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)
  const [step, setStep] = createSignal<TwoFactorStep>('password')
  const [totpUri, setTotpUri] = createSignal<string | null>(null)
  const [backupCodes, setBackupCodes] = createSignal<string[] | null>(null)

  /**
   * Step 1: Enable 2FA with password verification
   */
  const enableTwoFactor = async (password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.twoFactor.enable({
        password,
      })

      if (result.data?.totpURI) {
        setTotpUri(result.data.totpURI)
        setStep('qr-verify')
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to enable 2FA')
      setError(error)
      handleError(error, 'enable two-factor authentication')
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Step 2: Verify 2FA setup with TOTP code
   */
  const verifySetup = async (code: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.twoFactor.verifyTotp({
        code,
      })

      const codes = (result.data as { backupCodes?: string[] })?.backupCodes
      if (codes) {
        setBackupCodes(codes)
        setStep('backup-codes')

        const successMessage =
          config.ui?.successMessages?.['2fa-enabled'] ||
          'Two-factor authentication enabled successfully!'

        toast.success(successMessage)
        options.onSuccess?.()
        config.onSuccess?.('2fa-enabled')
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to verify 2FA code')
      setError(error)
      handleError(error, 'verify 2FA code')
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Reset hook state
   */
  const reset = () => {
    setError(null)
    setStep('password')
    setTotpUri(null)
    setBackupCodes(null)
  }

  return {
    /** Enable 2FA with password verification */
    enableTwoFactor,

    /** Verify 2FA setup with TOTP code */
    verifySetup,

    /** Loading state */
    isLoading,

    /** Error (if any) */
    error,

    /** Current step in the flow */
    step,

    /** TOTP URI for QR code generation */
    totpUri,

    /** Backup codes (available after verification) */
    backupCodes,

    /** Reset hook state */
    reset,
  }
}
