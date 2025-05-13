import { useState, type FC } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    TextField,
    IconButton,
    Typography,
    Paper,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import './styles/DeviceManager.css'
import { observer } from 'mobx-react-lite'
import { useAuth$ } from '@/mst/provider'
import type { IDevice } from '@/mst/types'
import { SearchOffOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export const DeviceManager: FC = observer(() => {
    const { devicesDelta, insertEspUserDevice, user_devices, fetchEspDevices, clearDeviceData } = useAuth$()

    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null)
    const [macInput, setMacInput] = useState('')
    const [password, setPassword] = useState('')

    const handleClose = () => {
        setOpen(false)
        setSelectedDevice(null)
        setMacInput('')
        setPassword('')
    }

    const handleMacInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const mac = e.target.value
        setMacInput(mac)
        const device = devicesDelta.find((d) => d.mac_addr === mac)
        setSelectedDevice(device || null)
    }

    const handleAddDevice = () => {
        if (!selectedDevice || !password) return

        if (password !== selectedDevice.password) {
            return alert('Wrong device password')
        }

        insertEspUserDevice(selectedDevice).then(handleClose)
    }

    return (
        <Box className='device-manager'>
            <Box className='device-manager__header'>
                <Typography variant='h5' className='device-manager__title'>
                    Устройства
                </Typography>
                <IconButton
                    onClick={() => {
                        setOpen(true)
                        fetchEspDevices()
                    }}
                    color={'primary'}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            <List>
                {user_devices.map((device) => (
                    <Paper key={device} elevation={1} className='device-card'>
                        <Box className='device-card__content'>
                            <Box className='device-card__info'>
                                <Typography className='device-card__mac'>MAC: {device}</Typography>
                                <Typography className='device-card__status'>Статус: Подключено</Typography>
                            </Box>
                            <Button
                                variant='contained'
                                className='device-card__button'
                                onClick={() => {
                                    navigate(`/devices/${device}`)
                                    clearDeviceData()
                                }}
                            >
                                Открыть устройство
                            </Button>
                        </Box>
                    </Paper>
                ))}
            </List>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Добавить устройство</DialogTitle>
                <DialogContent>
                    {devicesDelta.length ? (
                        <TextField
                            fullWidth
                            label='MAC адрес устройства'
                            value={macInput}
                            onChange={handleMacInputChange}
                            className='dialog-password'
                            margin='dense'
                        />
                    ) : (
                        <Box display='flex' alignItems='center' gap={1} mt={2}>
                            <SearchOffOutlined />
                            <Typography className='device-card__status'>{'Нет доступных устройств'}</Typography>
                        </Box>
                    )}
                    <TextField
                        fullWidth
                        label='Пароль устройства'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='dialog-password'
                        margin='dense'
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button onClick={handleAddDevice} disabled={!selectedDevice || !password} variant='contained'>
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
})
