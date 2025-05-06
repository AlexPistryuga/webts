import { getTadaServerClient, graphql, type VariablesOf } from '@tada-server'

const getUserEspDevices = graphql(`
    query getUserEspDevices($username: String!) {
        espusermac(where: { username: { _eq: $username } }) {
            mac_addr
        }
    }
`)

export async function fetchUserEspDevices(username: VariablesOf<typeof getUserEspDevices>['username']) {
    try {
        const { query } = await getTadaServerClient()

        const { data, error } = await query(getUserEspDevices, {
            username,
        })

        if (error) throw error

        return data
    } catch (e) {
        console.error(e)
        return
    }
}
