import { useAuth$ } from '@/mst/provider'
import {
    Box,
    Paper,
    Typography,
    Divider,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
} from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect, useState, type ComponentProps } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, type ChartEvent, type ActiveElement } from 'chart.js'
import { formatKey } from '@/helpers/formatKet.helper'
import type { TypedChartComponent } from 'react-chartjs-2/dist/types'
import type { ITab } from '@/mst/types'
import { getSnapshot } from 'mobx-state-tree'

interface DeviceDataMap {
    [mac: string]: {
        [key: string]: number[]
    }
}

interface SelectedKeys {
    [mac: string]: string[]
}

export const DevicesComposer: React.FC<{ devices: string[] }> = observer(({ devices }) => {
    const [selectedKeys, setSelectedKeys] = useState<SelectedKeys>(() => {
        const initialState: SelectedKeys = {}
        devices.forEach((mac) => {
            const saved = localStorage.getItem(`composer_keys_${mac}`)
            initialState[mac] = saved ? JSON.parse(saved) : []
        })
        return initialState
    })

    const [deviceDataMap, setDeviceDataMap] = useState<DeviceDataMap>({})
    const [timeLabels, setTimeLabels] = useState<string[]>([])
    const [availableKeys, setAvailableKeys] = useState<string[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogData, setDialogData] = useState<{
        mac: string
        id: number
        data: Record<string, unknown>
    } | null>(null)
    const [activeTab, setActiveTab] = useState<ITab>((localStorage.getItem('composer_view') as ITab) || 'table')

    const { devices_data, fetchDataForDevices, updateEspDataRecord } = useAuth$()

    const parseDataForCharts = () => {
        const keys = new Set<string>()
        const newDeviceDataMap: DeviceDataMap = {}
        const idAccumulator = new Set<string>()

        devices.forEach((mac) => {
            const deviceData = devices_data.get(mac)
            if (!deviceData) return

            if (!newDeviceDataMap[mac]) {
                newDeviceDataMap[mac] = {}
            }

            const macData = newDeviceDataMap[mac]
            if (!macData) return

            deviceData.forEach(({ data, id }) => {
                const parsed = JSON.parse(data)
                idAccumulator.add(id.toString())

                for (const key of Object.keys(parsed)) {
                    keys.add(key)
                    if (!macData[key]) {
                        macData[key] = []
                    }
                    macData[key].push(parsed[key])
                }
            })
        })

        setAvailableKeys(Array.from(keys))
        setDeviceDataMap(newDeviceDataMap)
        setTimeLabels(Array.from(idAccumulator))
    }

    useEffect(() => {
        const fetchAndParse = async () => {
            await fetchDataForDevices()
            parseDataForCharts()
        }

        fetchAndParse()
        const intervalId = setInterval(fetchAndParse, 12_000)

        return () => clearInterval(intervalId)
    }, [devices])

    const handleToggle = (mac: string, key: string) => {
        setSelectedKeys((prev) => {
            const currentMacSelection = prev[mac] || []
            const newSelection = currentMacSelection.includes(key)
                ? currentMacSelection.filter((k) => k !== key)
                : [...currentMacSelection, key]

            localStorage.setItem(`composer_keys_${mac}`, JSON.stringify(newSelection))

            return { ...prev, [mac]: newSelection }
        })
    }

    const handleSelectAllToggle = (mac: string) => {
        setSelectedKeys((prev) => {
            const currentMacSelection = prev[mac] || []
            const allMacKeys = availableKeys.filter(
                (key) => deviceDataMap[mac] && deviceDataMap[mac][key] !== undefined,
            )

            const newSelection = currentMacSelection.length === allMacKeys.length ? [] : allMacKeys

            localStorage.setItem(`composer_keys_${mac}`, JSON.stringify(newSelection))

            return { ...prev, [mac]: newSelection }
        })
    }

    const handleChartClick = (_event: ChartEvent, elements: ActiveElement[], chart: ChartJS) => {
        if (elements.length === 0 || !chart) return

        const element = elements[0]
        if (!element) return

        const { datasetIndex, index: elementIndex } = element

        const clickedDatasetLabel = chart.data.datasets[datasetIndex]?.label as string
        if (!clickedDatasetLabel) return

        const [keyPart, macPart] = clickedDatasetLabel.split(' (')
        const mac = macPart?.replace(')', '').trim()
        if (!mac) return

        const key = availableKeys.find((k) => formatKey(k) === keyPart)
        if (!key) return

        const selectedTimeLabel = timeLabels[elementIndex]
        if (!selectedTimeLabel) return

        const selectedDevice = devices_data.get(mac)?.[elementIndex]
        if (!selectedDevice) return

        setDialogData({
            mac,
            id: selectedDevice.id,
            data: { [key]: JSON.parse(selectedDevice.data)[key] },
        })
        setOpenDialog(true)
    }

    const handleTableRowClick = (mac: string, id: number, data: Record<string, unknown>) => {
        setDialogData({
            mac,
            id,
            data,
        })
        setOpenDialog(true)
    }

    const handleUpdateData = async () => {
        if (!dialogData) return

        const { mac, id, data: dialogValues } = dialogData
        const parsedData: Record<string, any> = {}

        const originalData = devices_data.get(mac)?.find((d) => d.id === id)?.data
        const parsedOriginalData = originalData ? JSON.parse(originalData) : {}

        for (const key in parsedOriginalData) {
            const originalValue = parsedOriginalData[key]
            const dialogValue = dialogValues[key]

            if (dialogValue !== undefined) {
                const originalType = typeof originalValue

                if (originalType === 'number') {
                    const numValue = parseFloat(String(dialogValue).replace(',', '.'))
                    if (!isNaN(numValue)) {
                        parsedData[key] = numValue
                    } else {
                        alert(`Значение ${dialogValue} для параметра ${key} не соответствует типу number`)
                        parsedData[key] = originalValue
                    }
                } else if (originalType === 'boolean') {
                    if (dialogValue === true || dialogValue === 'true') {
                        parsedData[key] = true
                    } else if (dialogValue === false || dialogValue === 'false') {
                        parsedData[key] = false
                    } else {
                        alert(`Значение ${dialogValue} для параметра ${key} не соответствует типу boolean`)
                        parsedData[key] = originalValue
                    }
                } else {
                    parsedData[key] = dialogValue
                }
            } else {
                parsedData[key] = originalValue
            }
        }

        await updateEspDataRecord({
            data: parsedData,
            id,
            mac_addr: mac,
        })

        parseDataForCharts()
        setOpenDialog(false)
    }

    const sharedChartData = {
        labels: timeLabels,
        datasets: devices.flatMap((mac) =>
            (selectedKeys[mac] || []).map((key) => ({
                label: `${formatKey(key)} (${mac})`,
                data: deviceDataMap[mac]?.[key] || [],
                fill: false,
                borderColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
                tension: 0.3,
            })),
        ),
    }

    const chartOptions: ComponentProps<TypedChartComponent<'line'>>['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: handleChartClick,
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90,
                },
            },
        },
    }

    return (
        <Box
            sx={{
                p: 3,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Tabs
                value={activeTab}
                onChange={(_, tab) => {
                    localStorage.setItem('composer_view', tab)
                    setActiveTab(tab)
                }}
                sx={{
                    mb: 3,
                    '& .MuiTabs-indicator': { height: '3px' },
                    '& .MuiTab-root': {
                        outline: 'none',
                        '&:focus': { outline: 'none' },
                    },
                }}
            >
                <Tab value='table' label='Таблицы' />
                <Tab value='charts' label='Графики' />
            </Tabs>

            {activeTab === 'charts' && (
                <Paper elevation={3} sx={{ p: 3, mb: 4, flexShrink: 0 }}>
                    <Typography variant='h6' gutterBottom>
                        Компаратор устройств
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {devices.map((mac) => {
                        const macKeys = availableKeys.filter(
                            (key) => deviceDataMap[mac] && deviceDataMap[mac][key] !== undefined,
                        )
                        const allMacSelected = macKeys.length > 0 && (selectedKeys[mac] || []).length === macKeys.length
                        const someMacSelected =
                            (selectedKeys[mac] || []).length > 0 && (selectedKeys[mac] || []).length < macKeys.length

                        return (
                            <Box key={mac} sx={{ mb: 3 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box
                                        component='pre'
                                        sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', marginRight: 1 }}
                                    >
                                        Устройство: {mac}
                                    </Box>

                                    <Checkbox
                                        checked={allMacSelected}
                                        indeterminate={someMacSelected && !allMacSelected}
                                        onChange={() => handleSelectAllToggle(mac)}
                                    />
                                </div>

                                <FormGroup row sx={{ flexWrap: 'wrap' }}>
                                    {macKeys.map((key) => (
                                        <FormControlLabel
                                            key={`${mac}-${key}`}
                                            control={
                                                <Checkbox
                                                    checked={(selectedKeys[mac] || []).includes(key)}
                                                    onChange={() => handleToggle(mac, key)}
                                                />
                                            }
                                            label={formatKey(key)}
                                        />
                                    ))}
                                </FormGroup>
                            </Box>
                        )
                    })}

                    {devices.some((mac) => (selectedKeys[mac] || []).length > 0) && (
                        <Box sx={{ mt: 3, width: '100%', overflowX: 'auto' }}>
                            <Typography variant='subtitle1' gutterBottom>
                                Общий график выбранных параметров
                            </Typography>
                            <Box sx={{ minWidth: `${timeLabels.length * 20}px` }}>
                                <Line data={sharedChartData} style={{ minHeight: 600 }} options={chartOptions} />
                            </Box>
                        </Box>
                    )}
                </Paper>
            )}

            {activeTab === 'table' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {availableKeys.map((key) => (
                        <Paper key={key} elevation={3} sx={{ p: 3 }}>
                            <Typography variant='h6' gutterBottom>
                                {formatKey(key)}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: 24, // 3 * 8px
                                }}
                            >
                                {devices.map((mac) => {
                                    const devicesForMac = devices_data.get(mac) || []
                                    return (
                                        <Box
                                            key={`${key}-${mac}-container`}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                variant='subtitle1'
                                                sx={{
                                                    fontWeight: 'bold',
                                                    px: 1,
                                                    py: 0.5,
                                                    backgroundColor: 'grey.100',
                                                    borderRadius: 1,
                                                }}
                                            >
                                                {mac}
                                            </Typography>

                                            <TableContainer
                                                sx={{
                                                    height: 'calc(100vh - 300px)',
                                                    overflowY: 'auto',
                                                }}
                                            >
                                                <Table size='small' stickyHeader>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>ID</TableCell>
                                                            <TableCell>Значение</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {devicesForMac.map((device) => {
                                                            const deviceData = JSON.parse(device.data)
                                                            const value = deviceData[key]
                                                            return (
                                                                <TableRow key={`${key}-${mac}-${device.id}`}>
                                                                    <TableCell>{device.id}</TableCell>
                                                                    <TableCell
                                                                        sx={{ cursor: 'pointer' }}
                                                                        onClick={() =>
                                                                            handleTableRowClick(mac, device.id, {
                                                                                [key]: value,
                                                                            })
                                                                        }
                                                                    >
                                                                        {value !== undefined ? String(value) : '-'}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )
                                })}
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth='sm' fullWidth>
                <DialogTitle>
                    {dialogData ? `Редактирование данных устройства ${dialogData.mac}` : 'Редактирование данных'}
                </DialogTitle>
                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {dialogData &&
                        Object.entries(dialogData.data).map(([key, value]) => {
                            const type = typeof value

                            if (type === 'boolean') {
                                return (
                                    <FormControlLabel
                                        key={key}
                                        sx={{ width: 'fit-content' }}
                                        control={
                                            <Checkbox
                                                checked={value as boolean}
                                                onChange={(e) =>
                                                    setDialogData((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  data: {
                                                                      ...prev.data,
                                                                      [key]: e.target.checked,
                                                                  },
                                                              }
                                                            : null,
                                                    )
                                                }
                                            />
                                        }
                                        label={formatKey(key)}
                                    />
                                )
                            }

                            return (
                                <TextField
                                    key={key}
                                    label={formatKey(key)}
                                    value={String(value)}
                                    type={'text'}
                                    onChange={({ target }) =>
                                        setDialogData((prev) =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      data: {
                                                          ...prev.data,
                                                          [key]: target.value,
                                                      },
                                                  }
                                                : null,
                                        )
                                    }
                                    fullWidth
                                />
                            )
                        })}
                </DialogContent>
                <DialogActions>
                    <Button variant={'contained'} onClick={handleUpdateData}>
                        Обновить данные
                    </Button>
                    <Button onClick={() => setOpenDialog(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
})
