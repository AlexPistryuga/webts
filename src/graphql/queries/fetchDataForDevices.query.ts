import type { IDevice } from '@/mst/types'
import { getTadaServerClient, graphql, type ResultOf, type VariablesOf } from '@tada-server'

const EspDataQuery = graphql(`
    query fetchDataForDevices($macs: [String!]!) {
        esp_data(where: { mac_addr: { _in: $macs } }, order_by: { id: asc }) {
            id
            mac_addr
            data
        }
    }
`)

export type ResultOfFetchDataForDevices = ResultOf<typeof EspDataQuery>['esp_data']

export async function fetchDataForDevices(macs: VariablesOf<typeof EspDataQuery>['macs']) {
    const { query } = await getTadaServerClient()

    const { data, error } = await query(EspDataQuery, { macs })

    if (error) throw error

    if (!data?.esp_data.length) return {}

    const groupedByMac: Record<IDevice['mac_addr'], typeof data.esp_data> = {}

    for (const esp of data.esp_data) {
        const entry = {
            id: esp.id,
            mac_addr: esp.mac_addr,
            data: JSON.stringify(esp.data),
        }

        if (!groupedByMac[esp.mac_addr]) {
            groupedByMac[esp.mac_addr] = []
        }

        groupedByMac[esp.mac_addr]?.push(entry)
    }

    return groupedByMac
}
