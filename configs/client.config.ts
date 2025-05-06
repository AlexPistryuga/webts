const EnvConfigs: ImportMetaEnv = import.meta.env

export const clientConfig = {
    host: 'http://localhost:8080/v1/graphql',
    secret: EnvConfigs['VITE_HASURA_ADMIN_SECRET'],
}
