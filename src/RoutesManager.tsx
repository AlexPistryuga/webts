import { Routes, Route, Navigate } from 'react-router-dom'

import './App.css'

import { LoginPage } from './modules/LoginPage'
import { MainPage } from './modules/MainPage'
import { useAuth$ } from './mst/provider'
import { observer } from 'mobx-react-lite'
import { Suspense, type FunctionComponent } from 'react'
import { DeviceDetails } from './modules/DeviceDetails2'
import Shell from './Shell'
import { DevicesComparator } from './modules/DevicesComparator'
import { useParamMac } from './helpers/url.helper'

export default observer(() => {
    const { is_authenticated } = useAuth$()

    const { selectedMac } = useParamMac()

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
                <Route
                    path={'/devices/:mac'}
                    element={selectedMac ? <DeviceDetails selectedMac={selectedMac} /> : null}
                />
                <Route path={'/devices/compare'} element={<DevicesComparator />} />

                <Route path={'/*'} element={<Navigate to={'/devices'} />} />
            </Routes>
        </Shell>
    )
}) satisfies FunctionComponent
