import { getTadaServerClient, graphql } from "../../../generated/tada/server-graphql"

const getEspDevices = graphql(`
    query getEspDevices {
        espmac {
            mac_addr
            password
        }
    }
`)

export async function fetchEspDevices() {
    try {
        const { query,  } = await getTadaServerClient()

        const { data, error } = await query(getEspDevices, {})

        if (error) throw error

        return data
    } catch(e) {
        console.error(e)
        return 

    }
}