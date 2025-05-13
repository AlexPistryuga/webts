import { useParamMac } from '@/helpers/url.helper'
import { useAuth$ } from '@/mst/provider'
import {
    Box,
    Paper,
    Typography,
    Divider,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect, useState, type FunctionComponent } from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { formatKey } from '@/helpers/formatKet.helper'
import { StyledFlexColumnShell } from './styled-components/MainPageStyles'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

export const DeviceDetails: FunctionComponent = observer(() => {
    const { device_data, fetchEspData } = useAuth$()
    const { selectedMac } = useParamMac()

    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const [dataMap, setDataMap] = useState<Record<string, number[]>>({})
    const [timeLabels, setTimeLabels] = useState<string[]>([])
    const [availableKeys, setAvailableKeys] = useState<string[]>([])
    const [tab, setTab] = useState<'charts' | 'table'>('table')

    useEffect(() => {
        const fetchAndParse = async () => {
            await fetchEspData()

            const keys = new Set<string>()
            const dataAccumulator: Record<string, number[]> = {}
            const timeAccumulator: string[] = []

            device_data.forEach(({ data }, index) => {
                const parsed = JSON.parse(data)
                timeAccumulator.push((index + 1).toString())

                for (const key of Object.keys(parsed)) {
                    keys.add(key)
                    if (!dataAccumulator[key]) {
                        dataAccumulator[key] = []
                    }
                    dataAccumulator[key].push(parsed[key])
                }
            })

            setAvailableKeys(Array.from(keys))
            setDataMap(dataAccumulator)
            setTimeLabels(timeAccumulator)
        }

        fetchAndParse()
        const intervalId = setInterval(fetchAndParse, 12_000)
        return () => clearInterval(intervalId)
    }, [])

    const handleToggle = (key: string) => {
        setSelectedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
    }

    const sharedChartData = {
        labels: timeLabels,
        datasets: selectedKeys.map((key) => ({
            label: formatKey(key),
            data: dataMap[key] || [],
            fill: false,
            borderColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
            tension: 0.3,
        })),
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
                value={tab}
                onChange={(_, v) => setTab(v)}
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

            {tab === 'table' && (
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant='h6' gutterBottom>
                        Таблица данных
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <TableContainer sx={{ height: 760 }}>
                        <Table size='small' stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Номер</TableCell>
                                    {availableKeys.map((key) => (
                                        <TableCell key={key}>{formatKey(key)}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {timeLabels.map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        {availableKeys.map((key) => (
                                            <TableCell key={key}>{String(dataMap[key]?.[index])}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {tab === 'charts' && (
                <Paper elevation={3} sx={{ p: 3, mb: 4, flexShrink: 0 }}>
                    <Typography variant='h6' gutterBottom>
                        Информация об устройстве
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box component='pre' sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                        {selectedMac}
                    </Box>

                    <FormGroup row sx={{ mb: 2, flexWrap: 'wrap' }}>
                        {availableKeys.map((key) => (
                            <FormControlLabel
                                key={key}
                                control={
                                    <Checkbox checked={selectedKeys.includes(key)} onChange={() => handleToggle(key)} />
                                }
                                label={formatKey(key)}
                            />
                        ))}
                    </FormGroup>

                    {selectedKeys.length > 0 && (
                        <Box sx={{ mt: 3, width: '100%', overflowX: 'auto' }}>
                            <Typography variant='subtitle1' gutterBottom>
                                Общий график выбранных параметров
                            </Typography>
                            <Box sx={{ minWidth: `${timeLabels.length * 20}px` }}>
                                <Line
                                    data={sharedChartData}
                                    style={{ minHeight: 600 }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: {
                                                ticks: {
                                                    autoSkip: false,
                                                    maxRotation: 90,
                                                    minRotation: 90,
                                                },
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                </Paper>
            )}

            {tab === 'charts' && (
                <StyledFlexColumnShell>
                    {availableKeys.map((key) => (
                        <div key={key}>
                            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                                <Typography variant='subtitle2' gutterBottom>
                                    {formatKey(key)}
                                </Typography>
                                <Box sx={{ minHeight: '250px', width: '100%', overflowX: 'auto' }}>
                                    <div
                                        style={{
                                            minWidth: `${timeLabels.length * 60}px`,
                                            display: 'flex',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Line
                                            data={{
                                                labels: timeLabels,
                                                datasets: [
                                                    {
                                                        label: formatKey(key),
                                                        data: dataMap[key] || [],
                                                        fill: false,
                                                        borderColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
                                                        tension: 0.3,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                maintainAspectRatio: false,
                                                responsive: true,
                                            }}
                                        />
                                    </div>
                                </Box>
                            </Paper>
                        </div>
                    ))}
                </StyledFlexColumnShell>
            )}
        </Box>
    )
})
