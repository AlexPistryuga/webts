import type { Instance } from 'mobx-state-tree'
import type { Auth$ } from './stores/Auth.store'
import type { Device } from './models/Device.model'

export interface IAuth$ extends Instance<typeof Auth$> {}
export interface IDevice extends Instance<typeof Device> {}
