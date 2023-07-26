import CloseIcon from '@mui/icons-material/Close'
import {
	Autocomplete,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	Input,
	InputLabel,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material'

import moment from 'moment'
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '../../../hooks'
import { setSnackbarMessage } from '../../../pages/appSlice'
import {
	deleteRecordHours,
	getRecordHours,
	postRecordHours,
	putRecordHours,
} from '../../../services/deviceUsageHoursServices'
import {
	dummyDeviceRecordUsageHours,
	IDeviceRecordUsageHours,
	IDeviceUsageHours,
} from '../../../types/deviceUsageHoursType'
import { DialogProps } from './DialogType'
import { StyledTableCell } from './ultis'
import { postCheckFileImport } from '../../../services/deviceServices'

const DialogDeviceUsageHours = ({ isOpen, onClose }: DialogProps) => {
	const [openAutocomplete, setOpenAutocomplete] = useState<boolean>(false)
	const [listDevice, setListDevice] = useState<IDeviceUsageHours[]>([])
	const loading = openAutocomplete && listDevice.length === 0
	const [deviceSelected, setDeviceSelected] = useState<IDeviceUsageHours | null>(null)
	const [selected, setSelected] = useState<IDeviceRecordUsageHours[]>([])
	const [recordInputValue, setRecordInputValue] = useState<IDeviceRecordUsageHours>(dummyDeviceRecordUsageHours)
	const [typeButton, setTypeButton] = useState<String>('POST')
	const [loadingSendRequest, setLoadingSendRequest] = useState<boolean>(false)
	const dispatch = useAppDispatch()

	const columns = useRef([
		{
			id: 'Month',
			header: 'Tháng',
		},
		{
			id: 'Year',
			header: 'Năm',
		},
		{
			id: 'HoursUsage',
			header: 'Số giờ',
		},
		{
			id: 'EmployeeName',
			header: 'Nhân viên nhập',
		},
		{
			id: 'DateInput',
			header: 'Ngày nhập',
			type: 'date',
		},
	])

	const getListDevice = async () => {
		try {
			const list: IDeviceUsageHours[] = await getRecordHours()

			if (Array.isArray(list)) {
				setListDevice(list)
			}
		} catch (error) {
			setListDevice([])
		}
	}

	useEffect(() => {
		setDeviceSelected(null)
		setSelected([])
		setRecordInputValue(dummyDeviceRecordUsageHours)
		getListDevice()
	}, [isOpen])

	useEffect(() => {
		if (deviceSelected)
			setDeviceSelected(listDevice.find(x => x.DeviceInfoId === deviceSelected.DeviceInfoId) || null)
	}, [listDevice])

	useEffect(() => {
		let isExist: Boolean =
			deviceSelected?.listRecordHours.findIndex(
				x => x.Month === recordInputValue.Month && x.Year === recordInputValue.Year,
			) !== -1
		isExist ? setTypeButton('PUT') : setTypeButton('POST')
	}, [recordInputValue, deviceSelected])

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelected: IDeviceRecordUsageHours[] = deviceSelected?.listRecordHours?.map(n => n) || []
			if (newSelected) handleSelect(newSelected)
			return
		}
		handleSelect([])
	}

	const handleSelect = (value: IDeviceRecordUsageHours[]) => {
		setSelected(value)
	}

	const handleClick = (event: React.MouseEvent<unknown>, record: IDeviceRecordUsageHours) => {
		const selectedIndex = selected.findIndex(x => x.Month === record.Month && x.Year === record.Year)
		let newSelected: IDeviceRecordUsageHours[] = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, record)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
		}
		setRecordInputValue(record)
		handleSelect(newSelected)
	}

	const handleAddRecord = async () => {
		setLoadingSendRequest(true)
		if (deviceSelected !== null) {
			let newData: IDeviceUsageHours = {
				...deviceSelected,
				listRecordHours: [
					{
						...recordInputValue,
						DateInput: `${Math.floor(Date.now() / 1000)}`,
					},
				],
			}

			try {
				if (typeButton === 'POST') {
					await postRecordHours(newData)
					dispatch(setSnackbarMessage('Thêm thành công!!!'))
				}
				if (typeButton === 'PUT') {
					await putRecordHours(newData)
					dispatch(setSnackbarMessage('Sửa thành công!!!'))
				}
				getListDevice()
			} catch (error) {
				dispatch(setSnackbarMessage('Đã xảy ra lỗi!!!'))
			} finally {
				setLoadingSendRequest(false)
			}
		}
	}

	const handleDeleteRecord = async () => {
		if (deviceSelected !== null && selected.length !== 0) {
			setLoadingSendRequest(true)
			let deleteData: IDeviceUsageHours = {
				...deviceSelected,
				listRecordHours: selected,
			}
			try {
				await deleteRecordHours(deleteData)
				dispatch(setSnackbarMessage('Xóa thành công!!!'))
				setSelected([])
				getListDevice()
			} catch (error) {
				dispatch(setSnackbarMessage('Đã xảy ra lỗi!!!'))
			} finally {
				setLoadingSendRequest(false)
			}
		}
	}

	const handleChangeFileImport = async (event: ChangeEvent<HTMLInputElement>) => {
		const formData = new FormData()
		if (event.target.files && event.target.files.length > 0) {
			formData.append('file', event.target.files[0])
		}

		const rs = await postCheckFileImport(formData)
		console.log(rs)
	}

	return (
		<Dialog open={isOpen} onClose={onClose} PaperProps={{ style: { width: '800px', maxWidth: 'unset' } }}>
			<DialogTitle textAlign="left">
				<b>Giờ sử dụng Thiết bị</b>

				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: theme => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ paddingTop: '8px' }}>
				<Grid container spacing={2}>
					<Grid item xs={8}>
						<TextField label="Mã Thiết bị" variant="standard" type="text" fullWidth />
						<TextField label="Mã định danh thiết bị" variant="standard" type="text" fullWidth />
						<TextField label="Tên thiết bị" variant="standard" type="text" fullWidth />
						<TextField label="Tên tiếng anh" variant="standard" type="text" fullWidth />
						<TextField label="Vị trí" variant="standard" type="text" fullWidth />
					</Grid>
					<Grid item xs={4}>
						<Box>
							<Button
								variant="contained"
								sx={{
									padding: 0,
									minWidth: 0,
									mb: '8px',
								}}
							>
								<InputLabel
									sx={{
										padding: '6px 8px',
										minWidth: '64px',
										color: 'white',
									}}
									htmlFor="importUsageHour"
								>
									Tải mẫu file import
									<input
										type="file"
										name="importUsageHour"
										id="importUsageHour"
										hidden
										onChange={handleChangeFileImport}
									/>
								</InputLabel>
							</Button>
						</Box>
						<Box>
							<Button
								variant="contained"
								sx={{
									padding: 0,
									minWidth: 0,
									mb: '8px',
								}}
							>
								<InputLabel
									sx={{
										padding: '6px 8px',
										minWidth: '64px',
										color: 'white',
									}}
									htmlFor="attachFile"
								>
									Đính kèm file
									<input type="file" name="attachFile" id="attachFile" hidden />
								</InputLabel>
							</Button>
						</Box>
						<Box>
							<Button
								sx={{
									padding: 0,
									minWidth: 0,
									mb: '8px',
								}}
								variant="contained"
							>
								<InputLabel
									sx={{
										padding: '6px 8px',
										minWidth: '64px',
										color: 'white',
									}}
									htmlFor="import"
								>
									Import
									<input type="file" name="import" id="import" hidden />
								</InputLabel>
							</Button>
						</Box>
					</Grid>
				</Grid>
				<Box my={3}>
					<Grid container spacing={2}>
						<Grid item md={2} xs={4}>
							<TextField
								label="Tháng"
								variant="standard"
								type="number"
								fullWidth
								inputProps={{
									min: 1,
									max: 12,
									value: `${recordInputValue.Month}`,
								}}
								onChange={e => {
									setRecordInputValue(prev => ({
										...prev,
										Month: Number(e.target.value),
									}))
								}}
							/>
						</Grid>
						<Grid item md={2} xs={4}>
							<TextField
								label="Năm"
								variant="standard"
								type="number"
								fullWidth
								inputProps={{
									value: `${recordInputValue.Year}`,
								}}
								onChange={e => {
									setRecordInputValue(prev => ({
										...prev,
										Year: Number(e.target.value),
									}))
								}}
							/>
						</Grid>
						<Grid item md={2} xs={4}>
							<TextField
								label="Số giờ"
								variant="standard"
								type="number"
								fullWidth
								inputProps={{
									value: `${recordInputValue.HoursUsage}`,
									min: 0,
								}}
								onChange={e => {
									setRecordInputValue(prev => ({
										...prev,
										HoursUsage: Number(e.target.value),
									}))
								}}
							/>
						</Grid>
						<Grid item md={3} xs={12}>
							<TextField
								label="Người nhập"
								variant="standard"
								disabled={true}
								fullWidth
								defaultValue={recordInputValue.EmployeeName}
							/>
						</Grid>
						<Grid item md={3} xs={12} sx={{ display: 'flex', alignItems: 'flex-end' }}>
							<Button
								variant="contained"
								sx={{ width: '50%', marginRight: '8px' }}
								onClick={handleAddRecord}
								disabled={!deviceSelected || loadingSendRequest}
							>
								{typeButton === 'POST' && !loadingSendRequest && 'Thêm'}
								{typeButton === 'PUT' && !loadingSendRequest && 'Sửa'}
								{loadingSendRequest && <CircularProgress color="inherit" size={24} />}
							</Button>
							<Button
								variant="contained"
								color="error"
								sx={{ width: '50%', marginLeft: '8px' }}
								onClick={handleDeleteRecord}
								disabled={selected.length === 0 || loadingSendRequest}
							>
								{loadingSendRequest ? <CircularProgress color="inherit" size={24} /> : 'Xóa'}
							</Button>
						</Grid>

						<Grid item md={12} xs={12} sx={{ display: 'flex', alignItems: 'flex-end' }}>
							<b style={{ textAlign: 'right', width: '100%' }}>Tổng giờ sử dụng: 0 giờ</b>
						</Grid>
					</Grid>
				</Box>

				<Table size="small" aria-label="purchases" sx={{ padding: '8px' }}>
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox" sx={{ background: '#d3d3d3' }}>
								<Checkbox
									color="primary"
									indeterminate={
										selected.length > 0 &&
										selected.length < (deviceSelected?.listRecordHours.length || 0)
									}
									checked={
										(deviceSelected?.listRecordHours?.length || 0) > 0 &&
										selected.length === deviceSelected?.listRecordHours?.length
									}
									onChange={handleSelectAllClick}
									inputProps={{
										'aria-label': 'select all desserts',
									}}
								/>
							</TableCell>
							<StyledTableCell>
								<b>#</b>
							</StyledTableCell>
							{columns.current.map(col => {
								return (
									<StyledTableCell key={col.id}>
										<b>{col.header}</b>
									</StyledTableCell>
								)
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{deviceSelected &&
							deviceSelected?.listRecordHours?.map((device, index) => {
								let isSelect: boolean | undefined =
									selected.find(x => x.Month === device.Month && x.Year === device.Year) !== undefined
								return (
									<TableRow
										key={index}
										selected={isSelect}
										role="checkbox"
										onClick={event => handleClick(event, device)}
										sx={{ position: 'relative' }}
									>
										<TableCell padding="checkbox">
											<Checkbox color="primary" checked={isSelect} />
										</TableCell>
										<TableCell align="left">
											<b>{index + 1}</b>
										</TableCell>
										{columns.current.map(col => {
											if (col.type === 'date')
												return (
													<TableCell align="left" key={col.id}>
														{moment
															.unix(Number(device[col.id as keyof typeof device]))
															.format('DD/MM/YYYY')}
													</TableCell>
												)

											return (
												<TableCell align="left" key={col.id}>
													{`${device[col.id as keyof typeof device] || ''}`}
												</TableCell>
											)
										})}
									</TableRow>
								)
							})}

						{(deviceSelected?.listRecordHours.length === 0 || deviceSelected === null) && (
							<TableRow>
								<TableCell colSpan={7}>
									<Typography variant="h5" gutterBottom align="center" component="div">
										Trống
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</DialogContent>
		</Dialog>
	)
}

export default DialogDeviceUsageHours
