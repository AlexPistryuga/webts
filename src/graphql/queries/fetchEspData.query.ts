import { getTadaServerClient, graphql, type VariablesOf } from '@tada-server'

const EspDataQuery = graphql(`
    query fetchEspData($mac: String!) {
        esp_data(where: { mac_addr: { _eq: $mac } }) {
            mac_addr
            data
        }
    }
`)

export async function fetchEspData(mac: VariablesOf<typeof EspDataQuery>['mac']) {
    const { query } = await getTadaServerClient()

    const { data, error } = await query(EspDataQuery, { mac })

    if (error) throw error

    if (!data?.esp_data.length) return []

    /** @emits data can be object of any structure */
    return data.esp_data.map((esp) => ({
        mac_addr: esp.mac_addr,
        data: JSON.stringify(esp.data),
    }))
}
