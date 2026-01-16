/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_SITE_URL: string
  // Add other environment variables here as needed

  // Index signature for dynamic access
  [key: string]: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
