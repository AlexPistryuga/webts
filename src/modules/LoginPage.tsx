import React, { useState, type FC } from 'react'
import { Box, Tab, Tabs, TextField, Button, Container } from '@mui/material'

import { StyledPaper, styles } from '../styles/LoginPageStyles'
import { TabPanel } from './shared/TabPanel'
import { useAuth$ } from '@/mst/provider'
import { observer } from 'mobx-react-lite'

export const LoginPage: FC = observer(() => {
    const { login, register } = useAuth$()

    const [tabValue, setTabValue] = useState(0)
    const [loginData, setLoginData] = useState({ username: '', password: '' })
    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    })

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault()

        const { confirmPassword, ...registerDataToSend } = registerData

        if (registerDataToSend.password !== confirmPassword) {
            return alert('Different passwords')
        }

        await register(registerDataToSend)

        setTabValue(0)
        setRegisterData({ username: '', password: '', confirmPassword: '' })
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100vw',
                height: '100vh',
            }}
        >
            <StyledPaper elevation={3} sx={{ maxWidth: 600, width: '100%' }}>
                <Box sx={styles.tabs}>
                    <Tabs value={tabValue} onChange={(_, tab) => setTabValue(tab)} centered>
                        <Tab label='Вход' />
                        <Tab label='Регистрация' />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            login(loginData)
                        }}
                    >
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            label='Имя пользователя'
                            value={loginData.username}
                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        />
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            label='Пароль'
                            type='password'
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                        <Button type='submit' fullWidth variant='contained' sx={styles.formButton}>
                            Войти
                        </Button>
                    </form>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <form onSubmit={handleRegister}>
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            label='Имя пользователя'
                            value={registerData.username}
                            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        />
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            label='Пароль'
                            type='password'
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        />
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            label='Подтвердите пароль'
                            type='password'
                            value={registerData.confirmPassword}
                            onChange={(e) =>
                                setRegisterData({
                                    ...registerData,
                                    confirmPassword: e.target.value,
                                })
                            }
                        />
                        <Button type='submit' fullWidth variant='contained' sx={styles.formButton}>
                            Зарегистрироваться
                        </Button>
                    </form>
                </TabPanel>
            </StyledPaper>
        </Box>
    )
})
