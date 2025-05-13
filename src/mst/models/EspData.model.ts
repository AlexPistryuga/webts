import { types } from 'mobx-state-tree'

export const EspData = types.model('EspDataModel', {
    id: types.identifierNumber,
    mac_addr: types.string,
    data: types.string,
})
