import { types } from 'mobx-state-tree'

export const Device = types.model('DeviceModel', {
    mac_addr: types.identifier,
    password: types.string,
})
