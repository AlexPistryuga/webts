// ControlPanel.tsx
import { Button } from '@mui/material'
import React from 'react'

interface Props {
    onLogout: () => void
}

const ControlPanel: React.FC<Props> = ({ onLogout }) => {
    const handleLogout = () => {
        localStorage.setItem('authorized', 'false')
        onLogout() // Notify parent to redirect
    }

    return (
        <div>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    )
}

export default ControlPanel
