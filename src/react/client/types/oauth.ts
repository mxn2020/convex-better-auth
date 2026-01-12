// src/react/client/types/oauth.ts

/**
 * Type definitions for OAuth 2.1 Provider plugin client methods
 */

export interface OAuthClient {
  clientId: string
  clientSecret?: string
  name: string
  redirectUris?: string[]
  redirect_uris?: string[]
  type?: 'confidential' | 'public'
  skipConsent?: boolean
  skip_consent?: boolean
  enableEndSession?: boolean
  enable_end_session?: boolean
  clientSecretExpiresAt?: number
  client_secret_expires_at?: number
  createdAt?: string
  updatedAt?: string
}

export interface OAuthConsentData {
  accept: boolean
  scope?: string[]
}

export interface OAuthConsentResponse {
  redirectURI?: string
  redirect?: string
}

export interface OAuth2Methods {
  /**
   * Get all OAuth clients for the current user
   */
  getClients: (data: Record<string, never>) => Promise<{
    data: OAuthClient[] | null
    error: { message: string; redirect?: string } | null
  }>

  /**
   * Get a specific OAuth client by ID
   */
  getClient: (data: { client_id: string }) => Promise<{
    data: OAuthClient | null
    error: { message: string } | null
  }>

  /**
   * Get public client information (no authentication required)
   */
  getPublicClient: (data: { clientId: string }) => Promise<{
    data: OAuthClient | null
    error: { message: string } | null
  }>

  /**
   * Create a new OAuth client
   */
  createClient: (data: {
    name: string
    redirect_uris: string[]
    type?: 'confidential' | 'public'
  }) => Promise<{
    data: OAuthClient | null
    error: { message: string } | null
  }>

  /**
   * Update an existing OAuth client
   */
  updateClient: (data: {
    client_id: string
    name?: string
    redirect_uris?: string[]
  }) => Promise<{
    data: OAuthClient | null
    error: { message: string } | null
  }>

  /**
   * Delete an OAuth client
   */
  deleteClient: (data: { client_id: string }) => Promise<{
    data: { success: boolean } | null
    error: { message: string } | null
  }>

  /**
   * Handle OAuth consent (accept or deny)
   */
  consent: (data: OAuthConsentData) => Promise<{
    data: OAuthConsentResponse | null
    error: { message: string; redirect?: string } | null
  }>

  /**
   * Admin: Create a trusted OAuth client with special privileges
   */
  adminCreateClient: (data: {
    name: string
    redirect_uris: string[]
    skip_consent?: boolean
    enable_end_session?: boolean
    client_secret_expires_at?: number
    type?: 'confidential' | 'public'
  }) => Promise<{
    data: OAuthClient | null
    error: { message: string } | null
  }>
}
