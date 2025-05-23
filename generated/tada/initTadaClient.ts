import { HasuraCfg } from '@configs/env.config'
import { type Client, type ClientOptions, createClient, fetchExchange } from '@urql/core'

export const initTadaClient = (clientOptions?: Partial<ClientOptions>) => {
    let tadaClient: Client | undefined = undefined

    const getClient = async () => {
        tadaClient = await createTadaClient({ clientOptions })
        return tadaClient
    }

    async function createTadaClient({
        clientOptions,
    }: {
        clientOptions?: Partial<ClientOptions>
        anonymous?: boolean
    }) {
        const _clientOptions = clientOptions || {}

        _clientOptions.fetchOptions = {
            ..._clientOptions.fetchOptions,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                ['x-hasura-admin-secret']: HasuraCfg.secret,
            },
        }

        if (!clientOptions?.url) {
            _clientOptions.url = HasuraCfg.gql_endpoint
        }

        _clientOptions.exchanges = [fetchExchange, ...(_clientOptions.exchanges || [])]

        _clientOptions.requestPolicy = 'cache-and-network'

        return createClient(_clientOptions as ClientOptions)
    }

    return { getClient, createTadaClient }
}

export type KeyOf<T, K extends keyof NonNullable<T>> = NonNullable<T>[K]
