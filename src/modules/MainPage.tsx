import { useEffect, type FC } from 'react'
import { IconButton, Avatar } from '@mui/material'

import { ControlPanel } from '../shared/ControlPanel'

import { DeviceManager } from './DeviceManager'
import {
    MainContent,
    NavBar,
    NavItem,
    PageWrapper,
    ProfileSection,
    StyledRegisteredUser,
} from './styled-components/MainPageStyles'
import { observer } from 'mobx-react-lite'
import { useAuth$ } from '@/mst/provider'
import { getParsedJwt } from '@/persisted/token.parser'

export const MainPage: FC = observer(() => {
    const { fetchUserEspDevices } = useAuth$()
    const jwt = getParsedJwt()

    useEffect(() => {
        fetchUserEspDevices()
    }, [])

    return (
        <PageWrapper>
            <ProfileSection>
                <ControlPanel />
                <IconButton size='large'>
                    <Avatar sx={{ width: 40, height: 40 }} />
                </IconButton>
                <StyledRegisteredUser>{jwt?.username.toLocaleUpperCase() || 'ANONYMOUS'}</StyledRegisteredUser>
            </ProfileSection>

            <NavBar>
                <NavItem variant={'h6'}>Устройства</NavItem>
            </NavBar>

            <MainContent>
                <DeviceManager />
            </MainContent>
        </PageWrapper>
    )
})
