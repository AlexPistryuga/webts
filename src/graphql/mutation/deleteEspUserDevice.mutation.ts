import { getParsedJwtOrThrow } from '@/persisted/token.parser'
import { getTadaServerClient, graphql, type VariablesOf } from '@tada-server'

const EspUserDeviceDelete = graphql(`
    mutation insertEspUserDevice($username: String!, $mac_addr: String!) {
        delete_espusermac_by_pk(username: $username, mac_addr: $mac_addr) {
            mac_addr
        }
    }
`)

export async function deleteEspUserDevice(mac_addr: VariablesOf<typeof EspUserDeviceDelete>['mac_addr']) {
    const { mutation } = await getTadaServerClient()

    const { username } = getParsedJwtOrThrow()

    const { data, error } = await mutation(EspUserDeviceDelete, {
        username,
        mac_addr,
    })

    if (error) throw error

    return data?.delete_espusermac_by_pk?.mac_addr
}
