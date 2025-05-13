import { types } from 'mobx-state-tree'

export const EspData = types.model('EspDataModel', {
    mac_addr: types.identifier,
    data: types.string,
})
