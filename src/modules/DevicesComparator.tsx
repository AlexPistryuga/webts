import { decodeSelectedMacsFromPath } from '@/helpers/url.helper'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import type { FunctionComponent } from 'react'
import { DeviceDetails } from './DeviceDetails2'
import { DevicesComposer } from './DevicesComposer'
import { Box, Tabs, Tab, Paper } from '@mui/material'

export const DevicesComparator = observer(() => {
    const devices = decodeSelectedMacsFromPath()
    const [activeTab, setActiveTab] = useState<string>(() => {
        const savedTab = localStorage.getItem('composer_tab')
        return savedTab && (savedTab === 'compose' || devices.includes(savedTab)) ? savedTab : devices[0] || 'compose'
    })

    const handleChangeTab = (_: React.SyntheticEvent, newTab: string) => {
        setActiveTab(newTab)
        localStorage.setItem('composer_tab', newTab)
    }

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={2} sx={{ mx: 3, overflow: 'hidden' }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, value) => handleChangeTab(_, String(value))}
                    variant='scrollable'
                    scrollButtons='auto'
                    sx={{
                        '& .MuiTabs-indicator': { height: '3px' },
                        '& .MuiTab-root': {
                            outline: 'none',
                            '&:focus': { outline: 'none' },
                        },
                    }}
                >
                    {devices.map((mac) => (
                        <Tab
                            key={mac}
                            label={mac}
                            value={mac}
                            sx={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                minWidth: 120,
                                py: 1.5,
                            }}
                        />
                    ))}
                    <Tab
                        label='Компаратор устройств'
                        value='compose'
                        sx={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            minWidth: 160,
                            py: 1.5,
                        }}
                    />
                </Tabs>
            </Paper>

            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                {devices.map((mac) => (
                    <Box
                        key={mac}
                        role='tabpanel'
                        hidden={activeTab !== mac}
                        sx={{
                            height: '100%',
                            display: activeTab === mac ? 'flex' : 'none',
                        }}
                    >
                        {activeTab === mac && <DeviceDetails selectedMac={mac} />}
                    </Box>
                ))}

                <Box
                    role='tabpanel'
                    hidden={activeTab !== 'compose'}
                    sx={{
                        height: '100%',
                        display: activeTab === 'compose' ? 'flex' : 'none',
                    }}
                >
                    {activeTab === 'compose' && <DevicesComposer devices={devices} />}
                </Box>
            </Box>
        </Box>
    )
}) satisfies FunctionComponent
