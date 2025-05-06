import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'

import { LoginPage } from './modules/LoginPage'
import { MainPage } from './modules/MainPage'
import { useAuth$ } from './mst/provider'
import { observer } from 'mobx-react-lite'

export default observer(function () {
    const { is_authenticated } = useAuth$()

    return (
        <BrowserRouter>
            {!is_authenticated ? (
                <Routes>
                    <Route path={'/login'} element={<LoginPage />} />

                    <Route path={'/*'} element={<Navigate to={'/login'} />} />
                </Routes>
            ) : (
                <Routes>
                    <Route path={'/main'} element={<MainPage />} />

                    <Route path={'/*'} element={<Navigate to={'/main'} />} />
                </Routes>
            )}
        </BrowserRouter>
    )
})
