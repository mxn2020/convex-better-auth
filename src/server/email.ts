/**
 * Email sending utilities for authentication flows
 * Uses Resend for email delivery and React Email for templating
 */

import { Resend } from '@convex-dev/resend'
import { render } from '@react-email/components'
import React from 'react'
import type { ConvexBetterAuthConfig } from '../shared/config'
import VerifyEmail from './emails/verifyEmail'
import MagicLinkEmail from './emails/magicLink'
import VerifyOTP from './emails/verifyOTP'
import ResetPasswordEmail from './emails/resetPassword'
import {
  EMAIL_SUBJECT_VERIFICATION,
  EMAIL_SUBJECT_PASSWORD_RESET,
  EMAIL_SUBJECT_MAGIC_LINK,
  EMAIL_SUBJECT_OTP,
} from '../shared/constants'

/**
 * Creates a Resend client instance
 * @param components - Convex components object
 * @param testMode - Whether to run in test mode (default: false)
 */
export function createResendClient(components: any, testMode = false): Resend {
  return new Resend(components.resend, { testMode })
}

/**
 * Internal helper to send an email
 * Avoids awaiting to prevent timing attacks (as recommended by Better Auth docs)
 */
async function sendEmail(
  ctx: any,
  resend: Resend,
  config: ConvexBetterAuthConfig,
  {
    to,
    subject,
    html,
  }: {
    to: string
    subject: string
    html: string
  }
) {
  await resend.sendEmail(ctx, {
    from: config.email.from,
    to,
    subject,
    html,
  })
}

/**
 * Sends an email verification link
 */
export async function sendEmailVerification(
  ctx: any,
  resend: Resend,
  config: ConvexBetterAuthConfig,
  {
    to,
    url,
  }: {
    to: string
    url: string
  }
) {
  await sendEmail(ctx, resend, config, {
    to,
    subject: EMAIL_SUBJECT_VERIFICATION,
    html: await render(
      <VerifyEmail
        url={url}
        brandName={config.branding?.name}
        brandTagline={config.branding?.tagline}
        brandLogoUrl={config.branding?.logoUrl}
      />
    ),
  })
}

/**
 * Sends an OTP verification code
 */
export async function sendOTPVerification(
  ctx: any,
  resend: Resend,
  config: ConvexBetterAuthConfig,
  {
    to,
    code,
  }: {
    to: string
    code: string
  }
) {
  await sendEmail(ctx, resend, config, {
    to,
    subject: EMAIL_SUBJECT_OTP,
    html: await render(
      <VerifyOTP
        code={code}
        brandName={config.branding?.name}
        brandTagline={config.branding?.tagline}
        brandLogoUrl={config.branding?.logoUrl}
      />
    ),
  })
}

/**
 * Sends a magic link for passwordless sign-in
 */
export async function sendMagicLink(
  ctx: any,
  resend: Resend,
  config: ConvexBetterAuthConfig,
  {
    to,
    url,
  }: {
    to: string
    url: string
  }
) {
  await sendEmail(ctx, resend, config, {
    to,
    subject: EMAIL_SUBJECT_MAGIC_LINK,
    html: await render(
      <MagicLinkEmail
        url={url}
        brandName={config.branding?.name}
        brandTagline={config.branding?.tagline}
        brandLogoUrl={config.branding?.logoUrl}
      />
    ),
  })
}

/**
 * Sends a password reset link
 */
export async function sendResetPassword(
  ctx: any,
  resend: Resend,
  config: ConvexBetterAuthConfig,
  {
    to,
    url,
  }: {
    to: string
    url: string
  }
) {
  await sendEmail(ctx, resend, config, {
    to,
    subject: EMAIL_SUBJECT_PASSWORD_RESET,
    html: await render(
      <ResetPasswordEmail
        url={url}
        brandName={config.branding?.name}
        brandTagline={config.branding?.tagline}
        brandLogoUrl={config.branding?.logoUrl}
      />
    ),
  })
}

/**
 * Email sending utilities with configuration bound
 * Returns an object with all email sending functions pre-configured
 */
export function createEmailUtilities(
  resend: Resend,
  config: ConvexBetterAuthConfig
) {
  return {
    sendEmailVerification: (ctx: any, data: { to: string; url: string }) =>
      sendEmailVerification(ctx, resend, config, data),
    sendOTPVerification: (ctx: any, data: { to: string; code: string }) =>
      sendOTPVerification(ctx, resend, config, data),
    sendMagicLink: (ctx: any, data: { to: string; url: string }) =>
      sendMagicLink(ctx, resend, config, data),
    sendResetPassword: (ctx: any, data: { to: string; url: string }) =>
      sendResetPassword(ctx, resend, config, data),
  }
}
