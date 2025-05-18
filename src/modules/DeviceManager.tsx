import { Fragment, useState, type FC } from 'react'
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
    Checkbox,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { observer } from 'mobx-react-lite'
import { useAuth$ } from '@/mst/provider'
import type { IDevice } from '@/mst/types'
import { DeleteOutline, SearchOffOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import './styles/DeviceManager.css'

export const DeviceManager: FC = observer(() => {
    const { devicesDelta, insertEspUserDevice, user_devices, fetchEspDevices, clearDeviceData, deleteEspUserDevice } =
        useAuth$()

    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null)
    const [macInput, setMacInput] = useState('')
    const [password, setPassword] = useState('')
    const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set())
    const [macToDelete, setMacToDelete] = useState<string | null>(null)
    const [isCnfOpen, setIsCnfOpen] = useState(false)

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
            return alert('Неверный пароль от устройства')
        }

        insertEspUserDevice(selectedDevice).then(handleClose)
    }

    const toggleDeviceSelection = (mac: string) => {
        setSelectedDevices((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(mac)) newSet.delete(mac)
            else newSet.add(mac)
            return newSet
        })
    }

    const toggleSelectAll = () => {
        if (selectedDevices.size === user_devices.length) {
            setSelectedDevices(new Set())
        } else {
            setSelectedDevices(new Set(user_devices))
        }
    }

    const handleCompareClick = () => {
        const macs = Array.from(selectedDevices).join(',')
        navigate(`/devices/compare?macs=${encodeURIComponent(macs)}`)
    }

    const closeConfirmModal = () => setIsCnfOpen(false)

    const allSelected = selectedDevices.size === user_devices.length && user_devices.length > 0
    const someSelected = selectedDevices.size > 0 && selectedDevices.size < user_devices.length

    return (
        <Box className='device-manager'>
            <Box
                className='device-manager__header'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                mb={1}
                ml={2.5}
            >
                <Box display='flex' alignItems='center'>
                    <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleSelectAll} />
                    <Typography variant={'h5'} className='device-manager__title'>
                        Устройства
                    </Typography>
                </Box>

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
                        <Box className='device-card__content' display='flex' alignItems='center' gap={2}>
                            <Checkbox
                                checked={selectedDevices.has(device)}
                                onChange={() => toggleDeviceSelection(device)}
                                inputProps={{ 'aria-label': `Выбрать устройство ${device}` }}
                            />
                            <Box flexGrow={1}>
                                <Typography className='device-card__mac'>MAC: {device}</Typography>
                            </Box>
                            <Button
                                variant='contained'
                                className='device-card__button'
                                sx={{ ml: 1 }}
                                onClick={() => {
                                    navigate(`/devices/${device}`)
                                    clearDeviceData()
                                }}
                            >
                                Открыть устройство
                            </Button>

                            <Button
                                variant='outlined'
                                color='error'
                                onClick={() => {
                                    setMacToDelete(device)
                                    setIsCnfOpen(true)
                                }}
                            >
                                <DeleteOutline />
                            </Button>
                        </Box>
                    </Paper>
                ))}
            </List>

            <Button
                variant='outlined'
                color='info'
                onClick={handleCompareClick}
                sx={{
                    opacity: selectedDevices.size ? 1 : 0,
                    pointerEvents: selectedDevices.size ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease',
                    mt: 2,
                }}
            >
                Перейти к Компаратору ({selectedDevices.size})
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Добавить устройство</DialogTitle>
                <DialogContent>
                    {devicesDelta.length ? (
                        <Fragment>
                            <TextField
                                fullWidth
                                label='MAC адрес устройства'
                                value={macInput}
                                onChange={handleMacInputChange}
                                className='dialog-password'
                                margin='dense'
                            />

                            <TextField
                                fullWidth
                                label='Пароль устройства'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='dialog-password'
                                margin='dense'
                            />
                        </Fragment>
                    ) : (
                        <Box display='flex' alignItems='center' gap={1} mt={2}>
                            <SearchOffOutlined />
                            <Typography className='device-card__status'>{'Нет доступных устройств'}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>

                    <Button onClick={handleAddDevice} disabled={!selectedDevice || !password} variant='contained'>
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isCnfOpen} onClose={closeConfirmModal}>
                <DialogTitle>Подтвердите удаление</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить устройство <b>{macToDelete}</b>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmModal}>Отмена</Button>
                    <Button
                        onClick={() => {
                            if (macToDelete) {
                                deleteEspUserDevice(macToDelete)
                                closeConfirmModal()
                            }
                        }}
                        color='error'
                        variant='contained'
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
})
