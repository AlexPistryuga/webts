import { createContext, useContext } from 'react'
import type { IAuth$ } from './types'
import { Auth$ } from './stores/Auth.store'

export const auth$ = Auth$.create({})
export const AuthContext = createContext<IAuth$>(auth$)
export const Auth$Provider = AuthContext.Provider

export function useAuth$() {
    const auth$ = useContext(AuthContext)

    if (!auth$) {
        throw new Error('useRootStore must be used within a RootStoreProvider')
    }

    return auth$
}
