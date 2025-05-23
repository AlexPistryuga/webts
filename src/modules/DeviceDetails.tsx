// import { useParamMac } from '@/helpers/url.helper'
// import { useAuth$ } from '@/mst/provider'
// import {
//     Box,
//     Paper,
//     Typography,
//     Divider,
//     FormControlLabel,
//     Checkbox,
//     FormGroup,
//     Tabs,
//     Tab,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
//     TextField,
// } from '@mui/material'
// import { observer } from 'mobx-react-lite'
// import { useCallback, useEffect, useState, type ComponentProps, type FunctionComponent } from 'react'
// import { Line } from 'react-chartjs-2'
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     LineElement,
//     PointElement,
//     Title,
//     Tooltip,
//     Legend,
//     type ChartEvent,
//     type ActiveElement,
// } from 'chart.js'
// import { formatKey } from '@/helpers/formatKet.helper'
// import { StyledFlexColumnShell } from './styled-components/MainPageStyles'
// import type { TypedChartComponent } from 'react-chartjs-2/dist/types'

// ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

// export const DeviceDetails: FunctionComponent = observer(() => {
//     const { device_data, fetchEspData, updateEspDataRecord } = useAuth$()
//     const { selectedMac } = useParamMac()

//     const [selectedKeys, setSelectedKeys] = useState<string[]>([])
//     const [dataMap, setDataMap] = useState<Record<string, number[]>>({})
//     const [selectedRow, setSelectedRow] = useState<number | null>(null)
//     const [timeLabels, setTimeLabels] = useState<string[]>([])
//     const [availableKeys, setAvailableKeys] = useState<string[]>([])
//     const [tab, setTab] = useState<'charts' | 'table'>('table')

//     const [openDialog, setOpenDialog] = useState(false)
//     const [dialogData, setDialogData] = useState<Record<string, unknown>>({})

//     const parseDataForCharts = useCallback(() => {
//         const keys = new Set<string>()
//         const dataAccumulator: Record<string, number[]> = {}
//         const idAccumulator: string[] = []

//         device_data.forEach(({ data, id }) => {
//             const parsed = JSON.parse(data)
//             idAccumulator.push(id.toString())

//             for (const key of Object.keys(parsed)) {
//                 keys.add(key)
//                 if (!dataAccumulator[key]) {
//                     dataAccumulator[key] = []
//                 }
//                 dataAccumulator[key].push(parsed[key])
//             }
//         })

//         setAvailableKeys(Array.from(keys))
//         setDataMap(dataAccumulator)
//         setTimeLabels(idAccumulator)
//     }, [device_data])

//     useEffect(() => {
//         const fetchAndParse = async () => {
//             await fetchEspData()
//             parseDataForCharts()
//         }

//         fetchAndParse()
//         const intervalId = setInterval(fetchAndParse, 12_000)

//         return () => clearInterval(intervalId)
//     }, [fetchEspData, parseDataForCharts])

//     const handleToggle = (key: string) => {
//         setSelectedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
//     }

//     const sharedChartData = {
//         labels: timeLabels,
//         datasets: selectedKeys.map((key) => ({
//             label: formatKey(key),
//             data: dataMap[key] || [],
//             fill: false,
//             borderColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
//             tension: 0.3,
//         })),
//     }

//     const handleChartClick = (_event: ChartEvent, elements: ActiveElement[], chart: ChartJS) => {
//         if (elements.length > 0 && chart) {
//             const element = elements[0]

//             if (!element) return

//             const datasetIndex = element.datasetIndex
//             const elementIndex = element.index

//             const clickedDatasetLabel = chart.data.datasets[datasetIndex]?.label

//             const clickedKey = availableKeys.find((key) => formatKey(key) === clickedDatasetLabel)

//             const selected = timeLabels[elementIndex]
//             if (!selected) return

//             const selectedId = parseInt(selected)
//             const selectedDevice = device_data.find(({ id }) => id === selectedId)

//             if (selectedDevice && clickedKey) {
//                 const deviceData = JSON.parse(selectedDevice.data)

//                 const filteredData = {
//                     [clickedKey]: deviceData[clickedKey],
//                 }

//                 setSelectedRow(selectedId)
//                 setDialogData(filteredData)
//                 setOpenDialog(true)
//             }
//         }
//     }

//     const chartOptions: ComponentProps<TypedChartComponent<'line'>>['options'] = {
//         responsive: true,
//         maintainAspectRatio: false,
//         onClick: handleChartClick,
//         scales: {
//             x: {
//                 ticks: {
//                     autoSkip: false,
//                     maxRotation: 90,
//                     minRotation: 90,
//                 },
//             },
//         },
//     }

//     return (
//         <Box
//             sx={{
//                 p: 3,
//                 width: '100%',
//                 height: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 overflow: 'hidden',
//             }}
//         >
//             <Tabs
//                 value={tab}
//                 onChange={(_, v) => setTab(v)}
//                 sx={{
//                     mb: 3,
//                     '& .MuiTabs-indicator': { height: '3px' },
//                     '& .MuiTab-root': {
//                         outline: 'none',
//                         '&:focus': { outline: 'none' },
//                     },
//                 }}
//             >
//                 <Tab value='table' label='Таблицы' />
//                 <Tab value='charts' label='Графики' />
//             </Tabs>

//             {tab === 'table' && (
//                 <Paper elevation={3} sx={{ p: 3 }}>
//                     <Typography variant='h6' gutterBottom>
//                         Таблица данных
//                     </Typography>
//                     <Divider sx={{ mb: 2 }} />

//                     <TableContainer sx={{ height: 'calc(100vh - 220px)' }}>
//                         <Table size='small' stickyHeader>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>Номер</TableCell>
//                                     {availableKeys.map((key) => (
//                                         <TableCell key={key}>{formatKey(key)}</TableCell>
//                                     ))}
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {device_data.map(({ id, data }) => {
//                                     const parsed = JSON.parse(data)

//                                     return (
//                                         <TableRow
//                                             key={id}
//                                             hover
//                                             sx={{ cursor: 'pointer' }}
//                                             onClick={() => {
//                                                 setDialogData(parsed)
//                                                 setSelectedRow(id)
//                                                 setOpenDialog(true)
//                                             }}
//                                         >
//                                             <TableCell>{id}</TableCell>
//                                             {availableKeys.map((key) => (
//                                                 <TableCell key={key}>{String(parsed[key])}</TableCell>
//                                             ))}
//                                         </TableRow>
//                                     )
//                                 })}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                 </Paper>
//             )}

//             {tab === 'charts' && (
//                 <>
//                     <Paper elevation={3} sx={{ p: 3, mb: 4, flexShrink: 0 }}>
//                         <Typography variant='h6' gutterBottom>
//                             Информация об устройстве
//                         </Typography>

//                         <Divider sx={{ mb: 2 }} />

//                         <Box component='pre' sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
//                             {selectedMac}
//                         </Box>

//                         <FormGroup row sx={{ mb: 2, flexWrap: 'wrap' }}>
//                             {availableKeys.map((key) => (
//                                 <FormControlLabel
//                                     key={key}
//                                     control={
//                                         <Checkbox
//                                             checked={selectedKeys.includes(key)}
//                                             onChange={() => handleToggle(key)}
//                                         />
//                                     }
//                                     label={formatKey(key)}
//                                 />
//                             ))}
//                         </FormGroup>

//                         {selectedKeys.length > 0 && (
//                             <Box sx={{ mt: 3, width: '100%', overflowX: 'auto' }}>
//                                 <Typography variant='subtitle1' gutterBottom>
//                                     Общий график выбранных параметров
//                                 </Typography>
//                                 <Box sx={{ minWidth: `${timeLabels.length * 20}px` }}>
//                                     <Line data={sharedChartData} style={{ minHeight: 600 }} options={chartOptions} />
//                                 </Box>
//                             </Box>
//                         )}
//                     </Paper>

//                     <StyledFlexColumnShell>
//                         {availableKeys.map((key) => (
//                             <div key={key}>
//                                 <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
//                                     <Typography variant='subtitle2' gutterBottom>
//                                         {formatKey(key)}
//                                     </Typography>
//                                     <Box sx={{ minHeight: '250px', width: '100%', overflowX: 'auto' }}>
//                                         <div
//                                             style={{
//                                                 minWidth: `${timeLabels.length * 60}px`,
//                                                 display: 'flex',
//                                                 flexDirection: 'row',
//                                             }}
//                                         >
//                                             <Line
//                                                 data={{
//                                                     labels: timeLabels,
//                                                     datasets: [
//                                                         {
//                                                             label: formatKey(key),
//                                                             data: dataMap[key] || [],
//                                                             fill: false,
//                                                             borderColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
//                                                             tension: 0.3,
//                                                         },
//                                                     ],
//                                                 }}
//                                                 options={chartOptions}
//                                             />
//                                         </div>
//                                     </Box>
//                                 </Paper>
//                             </div>
//                         ))}
//                     </StyledFlexColumnShell>
//                 </>
//             )}

//             <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth='sm' fullWidth>
//                 <DialogTitle>Данные строки</DialogTitle>
//                 <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
//                     {Object.entries(dialogData).map(([key, value]) => {
//                         const type = typeof value

//                         if (type === 'boolean') {
//                             return (
//                                 <FormControlLabel
//                                     key={key}
//                                     sx={{ width: 'fit-content' }}
//                                     control={
//                                         <Checkbox
//                                             checked={value as boolean}
//                                             onChange={(e) =>
//                                                 setDialogData((prev) => ({
//                                                     ...prev,
//                                                     [key]: e.target.checked,
//                                                 }))
//                                             }
//                                         />
//                                     }
//                                     label={formatKey(key)}
//                                 />
//                             )
//                         }

//                         return (
//                             <TextField
//                                 key={key}
//                                 label={formatKey(key)}
//                                 value={String(value)}
//                                 type={'text'}
//                                 onChange={({ target }) =>
//                                     setDialogData((prev) => ({
//                                         ...prev,
//                                         [key]: target.value,
//                                     }))
//                                 }
//                                 fullWidth
//                             />
//                         )
//                     })}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button
//                         variant={'contained'}
//                         onClick={async () => {
//                             if (!selectedRow) return

//                             const parsedData: Record<string, any> = {}

//                             const originalData = device_data.find((device) => device.id === selectedRow)?.data
//                             const parsedOriginalData = originalData ? JSON.parse(originalData) : {}

//                             for (const key in parsedOriginalData) {
//                                 const originalValue = parsedOriginalData[key]
//                                 const dialogValue = dialogData[key]

//                                 if (dialogValue) {
//                                     const originalType = typeof originalValue

//                                     if (originalType === 'number') {
//                                         // case then provided value contains ,
//                                         const numValue = parseFloat((dialogValue as string).replace(',', '.'))

//                                         if (!isNaN(numValue)) parsedData[key] = numValue
//                                         else {
//                                             alert(`Значение ${dialogValue} для строки ${key} не соответствует типам`)
//                                             parsedData[key] = originalValue
//                                         }
//                                     } else {
//                                         parsedData[key] = dialogValue
//                                     }
//                                 } else {
//                                     parsedData[key] = originalValue
//                                 }
//                             }

//                             await updateEspDataRecord({ data: parsedData, id: selectedRow })
//                             parseDataForCharts()
//                             setOpenDialog(false)
//                         }}
//                     >
//                         Заменить данные
//                     </Button>
//                     <Button onClick={() => setOpenDialog(false)}>Закрыть</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     )
// })
