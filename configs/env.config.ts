const EnvConfigs: ImportMetaEnv = import.meta.env

const HasuraCfg = {
    gql_endpoint: 'http://localhost:8080/v1/graphql',
    secret: EnvConfigs.VITE_HASURA_ADMIN_SECRET,
}

const DefaultCfg = {
    server_base_url: 'http://localhost:8100',
    token_secret: EnvConfigs.VITE_TOKEN_SECRET_KEY,
}

export { HasuraCfg, DefaultCfg, EnvConfigs }
