import { getTadaServerClient, graphql, type VariablesOf } from '@tada-server'

const EspDataUpdate = graphql(`
    mutation updateEspDataRecord($id: Int!, $data: jsonb!) {
        update_esp_data_by_pk(pk_columns: { id: $id }, _set: { data: $data }) {
            id
            mac_addr
            data
        }
    }
`)

export async function updateEspDataRecord(variables: VariablesOf<typeof EspDataUpdate>) {
    const { mutation } = await getTadaServerClient()

    const { data, error } = await mutation(EspDataUpdate, variables)

    if (error) throw error

    const res = data?.update_esp_data_by_pk

    if (!res) return

    return {
        ...res,
        data: JSON.stringify(res.data),
    }
}
