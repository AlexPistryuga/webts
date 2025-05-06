import { useAuth$ } from '@/mst/provider'
import { Button } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { type FC } from 'react'

export const ControlPanel: FC = observer(() => {
    const { logout } = useAuth$()

    return (
        <div>
            <Button onClick={() => logout()}>Выйти</Button>
        </div>
    )
})
