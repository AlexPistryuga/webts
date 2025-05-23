/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GRAPHQL_ENDPOINT: string
    readonly VITE_HASURA_ADMIN_SECRET: string
    readonly VITE_TOKEN_SECRET_KEY: string
}
