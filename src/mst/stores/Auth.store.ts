import { fetchEspDevices } from '@/graphql/queries/fetchEspDevices.query'
import { fetchUserEspDevices } from '@/graphql/queries/fetchUserEspDevices.query'
import { cleanStringFields } from '@/helpers/trim.helper'
import { TokenStorage } from '@/persisted/token.storage'
import { authService } from '@/services/auth.service'
import { processServerError } from '@/services/axios.error'
import type { AxiosError } from 'axios'
import { applySnapshot, flow, toGenerator, types } from 'mobx-state-tree'
import { Device } from '../models/Device.model'
import type { IDevice } from '../types'
import { insertEspUserDevice } from '@/graphql/mutation/insertEspUserDevice.mutation'

export const Auth$ = types
    .model('AuthStore', {
        is_authenticated: types.optional(types.boolean, TokenStorage.has()),

        esp_devices: types.optional(types.array(Device), []),
        user_devices: types.optional(types.array(types.string), []),
    })
    // .volatile(() => ({ isFetching: false }))
    .views((self) => ({
        get devicesDelta() {
            return self.esp_devices.filter(({ mac_addr }) => !self.user_devices.includes(mac_addr))
        },
    }))
    .actions((self) => ({
        logout() {
            TokenStorage.clear()

            // reset store
            applySnapshot(self, {})
        },

        login: flow(function* (loginData: Parameters<typeof authService.login>[0]) {
            try {
                const { token } = yield* toGenerator(authService.login(cleanStringFields(loginData)))

                self.is_authenticated = true

                TokenStorage.set(token)
            } catch (e) {
                processServerError(e)
            }
        }),

        register: flow(function* (registerData: Parameters<typeof authService.register>[0]) {
            try {
                const { username } = yield* toGenerator(authService.register(cleanStringFields(registerData)))

                console.log('Registered user:', username)
            } catch (e) {
                processServerError(e)
            }
        }),

        fetchUserEspDevices: flow(function* () {
            try {
                const devices = yield* toGenerator(fetchUserEspDevices())

                self.user_devices.replace(devices)
            } catch (e) {
                processServerError(e)
            }
        }),

        fetchEspDevices: flow(function* () {
            try {
                const devices = yield* toGenerator(fetchEspDevices())

                self.esp_devices.replace(devices)
            } catch (e) {
                processServerError(e)
            }
        }),

        insertEspUserDevice: flow(function* (device: IDevice) {
            try {
                const inserted = yield* toGenerator(insertEspUserDevice(device.mac_addr))

                inserted && self.user_devices.push(inserted.mac_addr)
            } catch (e) {
                processServerError(e)
            }
        }),
    }))
    .actions((self) => ({
        updateField<Key extends keyof typeof self>(field: Key, value: (typeof self)[Key]) {
            self[field] = value
        },
    }))
