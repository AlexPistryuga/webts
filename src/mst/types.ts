import type { Instance } from 'mobx-state-tree'
import type { Auth$ } from './stores/Auth.store'

export interface IAuth$ extends Instance<typeof Auth$> {}
