import { getParsedJwtOrThrow } from '@/persisted/token.parser'
import { getTadaServerClient, graphql, type VariablesOf } from '@tada-server'

const EspUserDevicesInsert = graphql(`
    mutation insertEspUserDevice($username: String!, $mac_addr: String!) {
        insert_espusermac_one(object: { mac_addr: $mac_addr, username: $username }) {
            mac_addr
            username
        }
    }
`)

export async function insertEspUserDevice(mac_addr: VariablesOf<typeof EspUserDevicesInsert>['mac_addr']) {
    const { mutation } = await getTadaServerClient()

    const { username } = getParsedJwtOrThrow()

    const { data, error } = await mutation(EspUserDevicesInsert, {
        username,
        mac_addr,
    })

    if (error) throw error

    return data?.insert_espusermac_one
}
