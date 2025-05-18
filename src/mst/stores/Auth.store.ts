import { fetchEspDevices } from '@/graphql/queries/fetchEspDevices.query'
import { fetchUserEspDevices } from '@/graphql/queries/fetchUserEspDevices.query'
import { cleanStringFields } from '@/helpers/trim.helper'
import { TokenStorage } from '@/persisted/token.storage'
import { backendService } from '@/services/backend.service'
import { processServerError } from '@/services/axios.error'
import { applySnapshot, flow, toGenerator, types } from 'mobx-state-tree'
import { Device } from '../models/Device.model'
import type { IDevice } from '../types'
import { insertEspUserDevice } from '@/graphql/mutation/insertEspUserDevice.mutation'
import { fetchDataForDevices, type ResultOfFetchDataForDevices } from '@/graphql/queries/fetchDataForDevices.query'
import { EspData } from '../models/EspData.model'
import { decodeSelectedMacsFromPath, getSelectedMacFromPath, isComposerPath } from '@/helpers/url.helper'
import { updateEspDataRecord } from '@/graphql/mutation/updateEspDataRecord.mutation'
import { deleteEspUserDevice } from '@/graphql/mutation/deleteEspUserDevice.mutation'

export const Auth$ = types
    .model('AuthStore', {
        is_authenticated: types.optional(types.boolean, TokenStorage.has()),

        esp_devices: types.optional(types.array(Device), []),
        user_devices: types.optional(types.array(types.string), []),

        devices_data: types.optional(types.map(types.array(EspData)), {}),
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

        login: flow(function* (loginData: Parameters<typeof backendService.login>[0]) {
            try {
                const { token } = yield* toGenerator(backendService.login(cleanStringFields(loginData)))

                self.is_authenticated = true

                TokenStorage.set(token)
            } catch (e) {
                processServerError(e)
            }
        }),

        register: flow(function* (registerData: Parameters<typeof backendService.register>[0]) {
            try {
                const { username } = yield* toGenerator(backendService.register(cleanStringFields(registerData)))

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

        fetchDataForDevices: flow(function* () {
            let boundMacs: string[] = []

            if (isComposerPath()) {
                boundMacs = decodeSelectedMacsFromPath()
            } else {
                const selectedMac = getSelectedMacFromPath()

                if (!selectedMac) return

                boundMacs = [selectedMac]
            }

            self.isFetching = true

            try {
                const data_records = yield* toGenerator(fetchDataForDevices(boundMacs))

                self.devices_data.replace(data_records)
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

        deleteEspUserDevice: flow(function* (mac_addr: IDevice['mac_addr']) {
            try {
                const deleted = yield* toGenerator(deleteEspUserDevice(mac_addr))

                deleted && self.user_devices.remove(deleted)
            } catch (e) {
                processServerError(e)
            }
        }),

        updateEspDataRecord: flow(function* (params: ResultOfFetchDataForDevices[number]) {
            try {
                const { mac_addr, ...payload } = params

                const returning = yield* toGenerator(updateEspDataRecord(payload))

                if (!returning) return

                const data = self.devices_data.get(mac_addr)

                if (!data) return

                const index = data.findIndex(({ id }) => id === payload.id)

                if (index !== -1) data[index]!.data = returning.data
            } catch (e) {
                processServerError(e)
            }
        }),

        updateEspStatus: flow(function* (params: Parameters<typeof backendService.updateEspState>[0]) {
            try {
                yield* toGenerator(backendService.updateEspState(params))
            } catch (e) {
                processServerError(e)
            }
        }),
    }))
    .actions((self) => ({
        clearDeviceData() {
            self.devices_data.clear()
        },

        updateField<Key extends keyof typeof self>(field: Key, value: (typeof self)[Key]) {
            self[field] = value
        },
    }))
