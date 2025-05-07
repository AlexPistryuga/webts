import { getParsedJwt, getParsedJwtOrThrow } from '@/persisted/token.parser'
import { getTadaServerClient, graphql, type VariablesOf } from '@tada-server'

const getUserEspDevices = graphql(`
    query getUserEspDevices($username: String!) {
        espusermac(where: { username: { _eq: $username } }) {
            mac_addr
        }
    }
`)

export async function fetchUserEspDevices() {
    const { query } = await getTadaServerClient()

    const { username } = getParsedJwtOrThrow()

    const { data, error } = await query(getUserEspDevices, { username })

    if (error) throw error

    return data?.espusermac.map(({ mac_addr }) => mac_addr) || []
}
