/**
 * Hook for enabling two-factor authentication
 * Handles multi-step wizard: password → QR code → verify → backup codes
 */

import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
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
 *   if (step === 'password') {
 *     return (
 *       <form onSubmit={e => {
 *         e.preventDefault()
 *         enableTwoFactor(password)
 *       }}>
 *         <input type="password" />
 *         <button type="submit">Continue</button>
 *       </form>
 *     )
 *   }
 *
 *   if (step === 'qr-verify') {
 *     return (
 *       <>
 *         <QRCode value={totpUri} />
 *         <input onChange={e => verifySetup(e.target.value)} />
 *       </>
 *     )
 *   }
 *
 *   if (step === 'backup-codes') {
 *     return (
 *       <ul>
 *         {backupCodes?.map(code => (
 *           <li key={code}>{code}</li>
 *         ))}
 *       </ul>
 *     )
 *   }
 * }
 * ```
 */
export function useTwoFactorEnable(options: UseTwoFactorEnableOptions = {}) {
  const { config } = useAuthConfig()
  const { handleError } = useAuthError()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [step, setStep] = useState<TwoFactorStep>('password')
  const [totpUri, setTotpUri] = useState<string | null>(null)
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)

  /**
   * Step 1: Enable 2FA with password verification
   */
  const enableTwoFactor = useCallback(
    async (password: string) => {
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
    },
    [config, options, handleError]
  )

  /**
   * Step 2: Verify 2FA setup with TOTP code
   */
  const verifySetup = useCallback(
    async (code: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await authClient.twoFactor.verifyTotp({
          code,
        })

        const backupCodes = (result.data as { backupCodes?: string[] })?.backupCodes
        if (backupCodes) {
          setBackupCodes(backupCodes)
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
    },
    [config, options, handleError]
  )

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setError(null)
    setStep('password')
    setTotpUri(null)
    setBackupCodes(null)
  }, [])

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
