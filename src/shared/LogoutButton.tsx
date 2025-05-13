import { useAuth$ } from '@/mst/provider'
import { LogoutOutlined } from '@mui/icons-material'
import { Button } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { type FC } from 'react'

export const LogoutButton: FC = observer(() => {
    const { logout } = useAuth$()

    return (
        <div>
            <Button variant={'outlined'} size={'large'} onClick={() => logout()} startIcon={<LogoutOutlined />}>
                Выйти
            </Button>
        </div>
    )
})
