import { fetchEspDevices } from '@/graphql/queries/fetchEspDevices.query'
import { fetchUserEspDevices } from '@/graphql/queries/fetchUserEspDevices.query'
import { cleanStringFields } from '@/helpers/trim.helper'
import { TokenStorage } from '@/persisted/token.storage'
import { authService } from '@/services/auth.service'
import { processServerError } from '@/services/axios.error'
import { applySnapshot, flow, toGenerator, types } from 'mobx-state-tree'
import { Device } from '../models/Device.model'
import type { IDevice } from '../types'
import { insertEspUserDevice } from '@/graphql/mutation/insertEspUserDevice.mutation'
import { fetchEspData } from '@/graphql/queries/fetchEspData.query'
import { EspData } from '../models/EspData.model'
import { getSelectedMacFromPath } from '@/helpers/url.helper'
import { auth$ } from '../provider'
import { updateEspDataRecord } from '@/graphql/mutation/updateEspDataRecord.mutation'

export const Auth$ = types
    .model('AuthStore', {
        is_authenticated: types.optional(types.boolean, TokenStorage.has()),

        esp_devices: types.optional(types.array(Device), []),
        user_devices: types.optional(types.array(types.string), []),

        device_data: types.optional(types.array(EspData), []),
    })
    .volatile(() => ({ isFetching: false }))
    .views((self) => ({
        get devicesDelta() {
            return self.esp_devices.filter(({ mac_addr }) => !self.user_devices.includes(mac_addr))
        },
    }))
    .actions((self) => ({
        logout() {
            TokenStorage.clear()

            applySnapshot(self, { is_authenticated: false })
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

        fetchEspData: flow(function* () {
            const selected_mac = getSelectedMacFromPath()

            if (!selected_mac) return

            self.isFetching = true

            try {
                const esp_data = yield* toGenerator(fetchEspData(selected_mac))

                self.device_data.replace(esp_data)
            } catch (e) {
                processServerError(e)
            } finally {
                self.isFetching = false
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

        updateEspDataRecord: flow(function* (params: Parameters<typeof updateEspDataRecord>[0]) {
            try {
                const returning = yield* toGenerator(updateEspDataRecord(params))

                if (!returning) return

                const index = self.device_data.findIndex(({ id }) => id === params.id)

                if (index !== -1) self.device_data[index]!.data = returning.data
            } catch (e) {
                processServerError(e)
            }
        }),
    }))
    .actions((self) => ({
        clearDeviceData() {
            self.device_data.clear()
        },

        updateField<Key extends keyof typeof self>(field: Key, value: (typeof self)[Key]) {
            self[field] = value
        },
    }))
