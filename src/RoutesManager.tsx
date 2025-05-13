import { Routes, Route, Navigate } from 'react-router-dom'

import './App.css'

import { LoginPage } from './modules/LoginPage'
import { MainPage } from './modules/MainPage'
import { useAuth$ } from './mst/provider'
import { observer } from 'mobx-react-lite'
import { type FunctionComponent } from 'react'
import { DeviceDetails } from './modules/DeviceDetails'
import Shell from './Shell'

export default observer(() => {
    const { is_authenticated } = useAuth$()

    if (!is_authenticated) {
        return (
            <Routes>
                <Route path={'/login'} element={<LoginPage />} />

                <Route path={'/*'} element={<Navigate to={'/login'} />} />
            </Routes>
        )
    }

    return (
        <Shell>
            <Routes>
                <Route path={'/devices'} element={<MainPage />} />
                <Route path={'/devices/:mac'} element={<DeviceDetails />} />

                <Route path={'/*'} element={<Navigate to={'/devices'} />} />
            </Routes>
        </Shell>
    )
}) satisfies FunctionComponent
