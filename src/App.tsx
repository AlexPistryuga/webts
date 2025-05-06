import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'

import { LoginPage } from './pages/LoginPage'
import { MainPage } from './pages/MainPage'

function App() {
    const [isAuthorized, setIsAuthorized] = useState(localStorage.getItem('authorized') === 'true')

    return (
        <Router>
            <Routes>
                <Route
                    path='/main'
                    element={
                        isAuthorized ? <MainPage setIsAuthorized={setIsAuthorized} /> : <Navigate to='/login' replace />
                    }
                />
                <Route
                    path='/login'
                    element={
                        isAuthorized ? (
                            <Navigate to='/main' replace />
                        ) : (
                            <LoginPage onLogin={() => setIsAuthorized(true)} />
                        )
                    }
                />
                <Route path='/' element={<Navigate to='/login' replace />} />
            </Routes>
        </Router>
    )
}

export default App
