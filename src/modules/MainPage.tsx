import { useEffect, type FC } from 'react'
import { Typography, Button, IconButton, Avatar } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { fetchUserEspDevices } from '../graphql/queries/fetchUserEspDevices.query'
import { ControlPanel } from '../shared/ControlPanel'

import DeviceManager from './DeviceManager'
import {
    DeviceBox,
    MainContent,
    NavBar,
    NavItem,
    PageWrapper,
    ProfileSection,
} from './styled-components/MainPageStyles'

export const MainPage: FC = () => {
    const retrieveUserEspDevices = async () => {
        const result = await fetchUserEspDevices('artur')
        console.log(result)
    }

    useEffect(() => {
        retrieveUserEspDevices()
    }, [])

    return (
        <PageWrapper>
            <ProfileSection>
                <ControlPanel />
                <IconButton size='large'>
                    <Avatar sx={{ width: 40, height: 40 }} />
                </IconButton>
            </ProfileSection>

            <NavBar>
                <NavItem variant='h6'>Устройства</NavItem>
            </NavBar>

            <MainContent>
                <DeviceManager />
                <DeviceBox elevation={3}>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        Устройств пока нет
                    </Typography>
                    <Button variant='contained' startIcon={<AddIcon />} sx={{ mt: 2 }}>
                        Добавить новое
                    </Button>
                </DeviceBox>
            </MainContent>
        </PageWrapper>
    )
}
