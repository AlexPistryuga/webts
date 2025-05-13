import { observer } from 'mobx-react-lite'
import { useEffect, type FunctionComponent, type PropsWithChildren } from 'react'
import { useAuth$ } from './mst/provider'
import {
    NavBar,
    NavIconOutlined,
    PageWrapper,
    StyledFlexColumnShell,
    StyledFlexRowShell,
} from './modules/styled-components/MainPageStyles'
import { Avatar, Typography } from '@mui/material'
import { ChevronLeftOutlined, LogoutOutlined } from '@mui/icons-material'
import { getSignedUsername } from './persisted/token.parser'
import { useNavigate } from 'react-router-dom'
import { useParamMac } from './helpers/url.helper'

export default observer(function ({ children }) {
    const { fetchUserEspDevices, logout } = useAuth$()
    const { selectedMac } = useParamMac()

    const navigate = useNavigate()

    useEffect(() => {
        fetchUserEspDevices()
    }, [])

    return (
        <PageWrapper>
            <NavBar>
                {selectedMac && (
                    <NavIconOutlined variant={'button'} onClick={() => navigate('/devices', { replace: true })}>
                        <ChevronLeftOutlined />
                        <span style={{ whiteSpace: 'nowrap' }}>К устройствам</span>
                    </NavIconOutlined>
                )}

                <StyledFlexColumnShell sx={{ marginTop: 'auto' }}>
                    <NavIconOutlined variant={'button'} onClick={() => logout()}>
                        <LogoutOutlined />
                        <span style={{ whiteSpace: 'nowrap' }}>Выйти</span>
                    </NavIconOutlined>

                    <StyledFlexRowShell>
                        <Avatar sx={{ width: 40, height: 40 }} />

                        <Typography color={'white'} fontWeight={600}>
                            {getSignedUsername().toLocaleUpperCase()}
                        </Typography>
                    </StyledFlexRowShell>
                </StyledFlexColumnShell>
            </NavBar>

            {children}
        </PageWrapper>
    )
}) satisfies FunctionComponent<PropsWithChildren>
