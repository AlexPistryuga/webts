import React, { useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    TextField,
    IconButton,
    Typography,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import './styles/DeviceManager.css'

interface Device {
    id: string
    name: string
    isConnected: boolean
}

const DeviceManager: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
    const [password, setPassword] = useState('')
    const [devices, setDevices] = useState<Device[]>([])

    const availableDevices: Device[] = [
        { id: '1', name: 'Устройство 1', isConnected: false },
        { id: '2', name: 'Устройство 2', isConnected: false },
        { id: '3', name: 'Устройство 3', isConnected: false },
    ]

    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false)
        setSelectedDevice(null)
        setPassword('')
    }

    const handleDeviceSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const deviceId = event.target.value
        const device = availableDevices.find((d) => d.id === deviceId)
        if (device) {
            setSelectedDevice(device)
        }
    }

    const handleAddDevice = () => {
        if (selectedDevice && password) {
            setDevices([...devices, { ...selectedDevice, isConnected: true }])
            handleClose()
        }
    }

    return (
        <Box className='device-manager'>
            <Box className='device-manager__header'>
                <Typography variant='h5' className='device-manager__title'>
                    Устройства
                </Typography>
                <IconButton onClick={handleOpen} color='primary'>
                    <AddIcon />
                </IconButton>
            </Box>

            <List>
                {devices.map((device) => (
                    <Paper key={device.id} elevation={1} className='device-card'>
                        <Box className='device-card__content'>
                            <Box className='device-card__info'>
                                <Typography className='device-card__mac'>MAC: {device.name}</Typography>
                                <Typography className='device-card__status'>Статус: Подключено</Typography>
                            </Box>
                            <Button variant='contained' className='device-card__button'>
                                Открыть устройство
                            </Button>
                        </Box>
                    </Paper>
                ))}
            </List>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Добавить устройство</DialogTitle>
                <DialogContent>
                    <List>
                        <RadioGroup value={selectedDevice?.id || ''} onChange={handleDeviceSelect}>
                            {availableDevices.map((device) => (
                                <ListItem key={device.id} className='dialog-item'>
                                    <FormControlLabel value={device.id} control={<Radio />} label={device.name} />
                                </ListItem>
                            ))}
                        </RadioGroup>
                    </List>
                    {selectedDevice && (
                        <TextField
                            fullWidth
                            label='Пароль устройства'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='dialog-password'
                        />
                    )}
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
}

export default DeviceManager
