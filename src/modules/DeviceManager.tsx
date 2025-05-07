import { useState, type FC } from 'react'
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
import { observer } from 'mobx-react-lite'
import { useAuth$ } from '@/mst/provider'
import type { IDevice } from '@/mst/types'
import { SearchOffOutlined } from '@mui/icons-material'

export const DeviceManager: FC = observer(() => {
    const { devicesDelta, insertEspUserDevice, user_devices, fetchEspDevices } = useAuth$()

    const [open, setOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null)
    const [password, setPassword] = useState('')

    const handleClose = () => {
        setOpen(false)
        setSelectedDevice(null)
        setPassword('')
    }

    const handleDeviceSelect = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const device = devicesDelta.find((d) => d.mac_addr === target.value)

        device && setSelectedDevice(device)
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
                    color='primary'
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
                        <RadioGroup value={selectedDevice?.mac_addr || ''} onChange={handleDeviceSelect}>
                            {!!devicesDelta.length ? (
                                devicesDelta.map(({ mac_addr }) => (
                                    <ListItem key={mac_addr} className='dialog-item'>
                                        <FormControlLabel value={mac_addr} control={<Radio />} label={mac_addr} />
                                    </ListItem>
                                ))
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <SearchOffOutlined />
                                    <Typography className='device-card__status'>{'Нет доступных устройств'}</Typography>
                                </div>
                            )}
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
})
