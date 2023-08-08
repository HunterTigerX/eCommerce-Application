/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH: string;
  readonly VITE_API: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_CLIENT_SECRET: string;
  readonly VITE_PROJECT_KEY: string;
  readonly VITE_PROJECT_ADMIN_SCOPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
