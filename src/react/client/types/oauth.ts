// src/react/client/types/oauth.ts

/**
 * Type definitions for OAuth 2.1 Provider plugin client methods
 * These types are inferred from Better Auth OAuth Provider plugin
 */

export interface OAuthClient {
  clientId?: string
  clientSecret?: string
  client_name?: string
  name?: string
  redirectUris?: string[]
  redirect_uris?: string[]
  type?: 'confidential' | 'public' | 'web' | 'native' | 'spa'
  skipConsent?: boolean
  skip_consent?: boolean
  enableEndSession?: boolean
  enable_end_session?: boolean
  clientSecretExpiresAt?: number
  client_secret_expires_at?: number
  createdAt?: string
  updatedAt?: string
  [key: string]: any // Allow additional properties from Better Auth
}

export interface OAuthConsentData {
  accept: boolean
  scope?: string
}

export interface OAuthConsentResponse {
  redirect: boolean
  uri: string
}

/**
 * OAuth2 methods exposed by the oauthProviderClient plugin
 * Note: These are generated dynamically by Better Auth
 */
export interface OAuth2Methods {
  /**
   * Get all OAuth clients for the current user
   */
  getClients: (data: Record<string, never>) => Promise<{
    data: OAuthClient[] | null
    error: { message: string } | null
  }>

  /**
   * Get a specific OAuth client by ID (requires authentication)
   */
  getClient: (data: { client_id: string }) => Promise<{
    data: OAuthClient | null
    error: { message: string } | null
  }>

  /**
   * Get public client information (no authentication required)
   */
  publicClient: (query: { query: { client_id: string } }) => Promise<{
    data: OAuthClient | null
    error: { message: string } | null
  }>

  /**
   * Create a new OAuth client
   */
  createClient: (data: {
    client_name?: string
    redirect_uris: string[]
    type?: 'web' | 'native' | 'spa'
    scope?: string
    [key: string]: any
  }) => Promise<{
    data: (OAuthClient & { clientSecret: string }) | null
    error: { message: string } | null
  }>

  /**
   * Update an existing OAuth client
   */
  updateClient: (data: {
    client_id: string
    client_name?: string
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
    error: { message: string; code?: string; status: number; statusText: string } | null
  }>
}
