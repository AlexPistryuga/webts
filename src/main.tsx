import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

import './index.css'
import { auth$, Auth$Provider } from './mst/provider'
import { BrowserRouter } from 'react-router-dom'
import RoutesManager from './RoutesManager'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    shape: {
        borderRadius: 8,
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Auth$Provider value={auth$}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                <RoutesManager />
            </BrowserRouter>
        </ThemeProvider>
    </Auth$Provider>,
)
