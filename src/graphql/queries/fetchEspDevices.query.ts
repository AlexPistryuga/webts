import { getTadaServerClient, graphql } from '@tada-server'

const getEspDevices = graphql(`
    query getEspDevices {
        espmac {
            mac_addr
            password
        }
    }
`)

export async function fetchEspDevices() {
    const { query } = await getTadaServerClient()

    const { data, error } = await query(getEspDevices, {})

    if (error) throw error

    return data?.espmac || []
}
