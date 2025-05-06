import { cleanStringFields } from '@/helpers/trim.helper'
import { TokenStorage } from '@/persisted/token.storage'
import { authService } from '@/services/auth.service'
import { processServerError } from '@/services/axios.error'
import type { AxiosError } from 'axios'
import { flow, toGenerator, types } from 'mobx-state-tree'

export const Auth$ = types
    .model('AuthStore', {
        is_authenticated: types.optional(types.boolean, TokenStorage.has()),
    })
    .actions((self) => ({
        logout() {
            TokenStorage.clear()
            self.is_authenticated = false
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
    }))
    .actions((self) => ({
        updateField<Key extends keyof typeof self>(field: Key, value: (typeof self)[Key]) {
            self[field] = value
        },
    }))
