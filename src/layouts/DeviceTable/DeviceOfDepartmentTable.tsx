import CloseIcon from '@mui/icons-material/Close'
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'

import DataGrid, {
	Column,
	ColumnChooser,
	ColumnFixing,
	Button as DevButtonGrid,
	FilterPanel,
	FilterRow,
	Grouping,
	HeaderFilter,
	Item,
	LoadPanel,
	Pager,
	Paging,
	Toolbar,
} from 'devextreme-react/data-grid'
import ArrayStore from 'devextreme/data/array_store'
import DataSource from 'devextreme/data/data_source'
import { uniqueId } from 'lodash'
import moment from 'moment'
import { setSnackbarMessage } from '../../pages/appSlice'
import { deleteDevice } from '../../services/deviceDepartmentServices'
import { getDeviceHitories } from '../../services/deviceHistoryServices'
import { getInstrumentHitories } from '../../services/instrumentHistoryServices'
import { getMaintenanceDeviceById } from '../../services/maintenanceDevicesServices'
import { IDeviceDepartmentType } from '../../types/deviceDepartmentType'
import { IDeviceHistory } from '../../types/deviceHistoriesType'
import { IExportDeviceType } from '../../types/exportDeviceType'
import { IInstrumentHistory } from '../../types/instrumentHistoriesType'
import { IRepairDevice } from '../../types/maintenanceDevicesType'
import { DialogCreate, DialogDelete, DialogDeviceUsageHours, DialogLiquidate, DialogMaintenanceDevice } from './Dialog'
import { renderHeader } from './Dialog/DialogImportDeviceInfo'
import { ProviderValueType, useDeviceOfDepartmentTableStore } from './context/DeviceOfDepartmentTableContext'
const listDeviceType = ['Thiết bị', 'Công cụ', 'Dụng cụ']

 type DeviceColumnType = {
		id: string
		header: String
		type?: string
		data?: any
		size?: number
		renderValue?: (...args: any[]) => String
		hide?: boolean
 }

export function removeAccents(str: string) {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D')
}

const DeviceOfDepartmentTable = () => {
	const dispatch = useAppDispatch()
	const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false)
	const [isOpenDeviceUsageHours, setIsOpenDeviceUsageHours] = useState<boolean>(false)
	const [isOpenDeviceLiquidate, setIsOpenDeviceLiquidate] = useState<boolean>(false)
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false)
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false)
	const [deletedRow, setDeletedRow] = useState<IDeviceDepartmentType>()
	const [selectedDevice, setSelectedDevice] = useState<IDeviceDepartmentType>()
	const {
		devices,
		setDeviceValues,
		deviceType,
		setDeviceTypeValues,
		deviceData,
		setDeviceDataValues,
		getDeviceData,
	}: ProviderValueType = useDeviceOfDepartmentTableStore()

	useEffect(() => {
		getDeviceData()
	}, [deviceType])

	const handleDeviceUsageHours = () => {
		setIsOpenDeviceUsageHours(true)
	}

	const handleDeviceLiquidate = () => {
		setIsOpenDeviceLiquidate(true)
	}

	const handleSubmitDelete = async (DeviceId: String) => {
		try {
			const data = await deleteDevice(DeviceId)

			if (data) {
				dispatch(setSnackbarMessage('Xóa thông tin thành công'))
				const newData = deviceData[deviceType]?.filter((device: any) => DeviceId !== device?.DeviceId)
				setDeviceDataValues({
					...deviceData,
					[deviceType]: newData,
				})
				setDeviceValues(newData || [])
			} else {
				dispatch(setSnackbarMessage('Xóa thông tin không thành công'))
			}
		} catch (error) {
			dispatch(setSnackbarMessage('Xóa thông tin không thành công'))
		} finally {
			setIsOpenDeleteModal(true)
		}
	}

	const handleOpenCreate = () => {
		setIsOpenCreateModal(true)
	}

	const columns = useRef<DeviceColumnType[]>([
		{ id: 'DeviceId', header: 'Mã thiết bị' },
		{ id: 'DeviceName', header: 'Tên thiết bị' },
		{ id: 'DeviceEnglishName', header: 'Tên tiếng anh' },
		{
			id: 'QuantityImport',
			header: 'SL nhập',
		},
		{
			id: 'QuantityDistribute',
			header: 'SL phân phối',
		},
		{
			id: 'QuantityExport',
			header: 'SL xuất',
		},
		{
			id: 'QuantityAvailable',
			header: 'SL hiện có',
		},
	])

	const dataGridRef = useRef<DataGrid<any, any> | null>(null)

	const dataSource = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: (devices || []).map(x => ({ ...x, Id: uniqueId('Device_') })),
				key: 'Id',
			}),
		})
	}, [devices])
	return (
		<>
			<Box
				component="div"
				boxShadow="none"
				border="none"
				justifyContent="space-between"
				display="flex"
				flexWrap="wrap"
				m={2}
			>
				<Typography fontWeight="bold" variant="h6" whiteSpace="nowrap">
					Thiết bị
				</Typography>

				<Tooltip arrow placement="left" title="Tạo mới">
					<Button variant="contained" onClick={handleOpenCreate} sx={{ marginLeft: '24px' }}>
						Tạo mới
					</Button>
				</Tooltip>
				{/* <Box display="flex" alignItems="end" flexWrap="wrap" justifyContent="flex-end">
					<Box display="flex" alignItems="end" flexWrap="wrap" justifyContent="flex-end">
						<FormControlStyled>
							<RadioGroup
								aria-labelledby="radio-buttons-group-label"
								defaultValue={listDeviceType[0]}
								name="radio-buttons-group"
								sx={{ display: 'flex', flexDirection: 'row' }}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setDeviceTypeValues((event.target as HTMLInputElement).value)
								}}
							>
								{listDeviceType.map((type: string) => (
									<FormControlLabel
										value={type}
										control={<Radio />}
										label={type}
										key={type}
										checked={type === deviceType}
									/>
								))}
							</RadioGroup>
						</FormControlStyled>
					</Box>
				</Box> */}
			</Box>
			<Paper
				sx={{
					marginBottom: '24px',
					overflow: 'overlay',
					flex: '1',
					padding: '16px',
					boxShadow: 'none',
					border: 'none',
				}}
			>
				<DataGrid
					dataSource={dataSource}
					ref={dataGridRef}
					id="gridContainer"
					showBorders={true}
					columnAutoWidth={true}
					allowColumnResizing={true}
					columnResizingMode="widget"
					columnMinWidth={100}
					searchPanel={{
						visible: true,
						width: 240,
						placeholder: 'Tìm kiếm',
					}}
					editing={{
						confirmDelete: true,
						allowDeleting: true,
						allowAdding: true,
						allowUpdating: true,
					}}
					elementAttr={{ style: 'height: 100%; padding-bottom: 20px; width: 100%; min-width: 600px' }}
				>
					<ColumnChooser enabled={true} mode="select" />
					<Paging enabled={false} />
					<FilterRow visible={true} applyFilter={true} />
					<HeaderFilter visible={true} />
					<ColumnFixing enabled={false} />
					<Grouping contextMenuEnabled={true} expandMode="rowClick" />
					<FilterPanel visible={true} />
					<Pager
						allowedPageSizes={true}
						showInfo={true}
						showNavigationButtons={true}
						showPageSizeSelector={true}
						visible={true}
					/>
					<LoadPanel enabled={true} />
					<Paging defaultPageSize={30} />
					{columns.current.map(col => (
						<Column
							key={col.id}
							dataField={col.id}
							dataType="string"
							headerCellRender={data => renderHeader(data)}
							caption={col.header}
							cellRender={data => (
								<span>
									{Number(data.text) && col?.type === 'date'
										? moment.unix(Number(data.text)).format('DD/MM/YYYY')
										: data.text}
								</span>
							)}
						/>
					))}

					<Column type="buttons">
						<DevButtonGrid
							icon="chevrondown"
							onClick={(e: any) => {
								setSelectedDevice(e.row.data)
							}}
						/>
					</Column>
					<Toolbar>
						<Item name="columnChooserButton" />
						<Item name="searchPanel" showText="always" />
					</Toolbar>
				</DataGrid>
			</Paper>

			{isOpenCreateModal && (
				<DialogCreate isOpen={isOpenCreateModal} onClose={() => setIsOpenCreateModal(false)} />
			)}
			{isOpenDeleteModal && (
				<DialogDelete
					isOpen={isOpenDeleteModal}
					onClose={() => setIsOpenDeleteModal(false)}
					dataDelete={deletedRow}
					handleSubmitDelete={handleSubmitDelete}
				/>
			)}

			{isOpenDeviceUsageHours && (
				<DialogDeviceUsageHours
					isOpen={isOpenDeviceUsageHours}
					onClose={() => setIsOpenDeviceUsageHours(false)}
				/>
			)}
			{isOpenDeviceLiquidate && (
				<DialogLiquidate isOpen={isOpenDeviceLiquidate} onClose={() => setIsOpenDeviceLiquidate(false)} />
			)}

			{selectedDevice && (
				<RowDevice
					device={selectedDevice}
					isOpen={!!selectedDevice}
					handleClose={() => setSelectedDevice(undefined)}
				/>
			)}
			{isOpenCreateModal && (
				<DialogCreate isOpen={isOpenCreateModal} onClose={() => setIsOpenCreateModal(false)} />
			)}
		</>
	)
}

type RowDeviceProps = {
	device: IDeviceDepartmentType
	isOpen: boolean
	handleClose: () => void
}

const RowDevice = ({ device, isOpen, handleClose }: RowDeviceProps) => {
	const dataGridRef = useRef<DataGrid<any, any> | null>(null)
	const [isOpenDeviceUsageHours, setIsOpenDeviceUsageHours] = useState<boolean>(false)
	const [serialNumber, setSerialNumber] = useState<String>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [maintenanceDevice, setMaintenanceDevice] = useState<IRepairDevice | null>(null)
	const [isOpenMaintenance, setIsOpenMaintenance] = useState<boolean>(false)
	const [deviceHitories, setDeviceHistories] = useState<IDeviceHistory | IInstrumentHistory | null>(null)
	const [deviceDetails, setDeviceDetails] = useState<IExportDeviceType[]>([])
	const owner = useAppSelector(selector => selector.userManager.owner)
	const getMaintenanceDevice = async () => {
		setLoading(true)
		try {
			let maintenanceDevice: IRepairDevice = await getMaintenanceDeviceById(serialNumber)
			console.log(maintenanceDevice)
			if (maintenanceDevice) {
				console.log(1)
				setMaintenanceDevice(maintenanceDevice)
			} else {
				let index = deviceDetails.findIndex(x => x?.DeviceInfoId === serialNumber)
				// if (index !== -1) {
				// 	setMaintenanceDevice({
				// 		DeviceName: deviceName || '',
				// 		SerialNumber: deviceDetails[index]?.SerialNumber || '',
				// 		DeviceInfoId: deviceDetails[index]?.DeviceInfoId || '',
				// 		DateStartUsage: deviceDetails[index]?.DateStartUsage || '',
				// 		LastMaintenanceDate: '',
				// 		Unit: unit || '',
				// 		listRepair: [],
				// 	})
				// }
			}
		} catch (error) {
			setMaintenanceDevice(null)
		} finally {
			setLoading(false)
		}
	}

	const getHistoryDevice = async () => {
		setLoading(true)
		try {
			let deviceHitories: IDeviceHistory = await getDeviceHitories(serialNumber)
			setDeviceHistories(deviceHitories)
		} catch (error) {
			setDeviceHistories(null)
		} finally {
			setLoading(false)
		}
	}

	const getHistoryInstrument = async () => {
		console.log(serialNumber)
		setLoading(true)
		try {
			let deviceHitories: IInstrumentHistory = await getInstrumentHitories(serialNumber)
			setDeviceHistories(deviceHitories)
		} catch (error) {
			setDeviceHistories(null)
		} finally {
			setLoading(false)
		}
	}

	const handleCloseMaintenanceDialog = () => {
		setIsOpenMaintenance(false)
	}

	const handleCloseDeviceUsageHoursDialog = () => {
		setIsOpenDeviceUsageHours(false)
	}

	const handleOpenDeviceUsageHoursDialog = (serialNumber: String) => {
		setIsOpenDeviceUsageHours(true)
	}

	const handleOpenMaintenanceDialog = async (serialNumber: String) => {
		setIsOpenMaintenance(true)
		let maintenanceDevice: IRepairDevice = await getMaintenanceDeviceById(serialNumber)
		console.log(maintenanceDevice)
	}

	const dataSource = useMemo(() => {
		return new DataSource({
			store: new ArrayStore({
				data: (device?.listDeviceInfo || []).map(x => ({ ...x, Id: uniqueId('DeviceDetail_') })),
				key: 'Id',
			}),
		})
	}, [device])

	const [commonFieldsShow, setCommonFieldShow] = useState([
		{ id: 'DeviceId', header: 'Mã thiết bị', fixed: true },
		{ id: 'DeviceInfoId', header: 'Mã định danh thiết bị', fixed: true },
		{ id: 'DeviceName', header: 'Tên thiết bị', fixed: true },
		{ id: 'DeviceEnglishName', header: 'Tên tiếng anh' },
		{ id: 'Model', header: 'Số Model' },
		{ id: 'SerialNumber', header: 'Số Serial' },
		{ id: 'Specification', header: 'Thông số kỹ thuật' },
		{ id: 'Manufacturer', header: 'Hãng sản xuất' },
		{ id: 'Origin', header: 'Xuất xứ' },
		{ id: 'SupplierName', header: 'Nhà cung cấp' },
		{ id: 'Unit', header: 'Đvt' },
		{ id: 'QuantityImport', header: 'SL nhập' },
		{ id: 'QuantityDistribute', header: 'SL phân phối' },
		{ id: 'QuantityExport', header: 'SL xuất' },
		{ id: 'QuantityAvailable', header: 'SL hiện có' },
		{ id: 'DepartmentImportName', header: 'Đơn vị nhập' },
		{ id: 'DateImport', header: 'Ngày nhập', type: 'date' },
		{ id: 'YearStartUsage', header: 'Năm đưa vào sử dụng' },
		{
			id: 'StartGuarantee',
			header: 'Thời gian bắt đầu bảo hành',
			type: 'date',
		},
		{ id: 'EndGuarantee', header: 'Thời gian kết thúc bảo hành', type: 'date' },
		{
			id: 'PeriodicMaintenance',
			header: 'Chu kỳ hiệu chuẩn/bảo trì định kỳ',
			sx: { minWidth: '120px' },
		},
		{ id: 'Status', header: 'Tình trạng' },
		{
			id: 'DepartmentMaintenanceName',
			header: 'Đơn vị phụ trách hiệu chuẩn – bảo trì/sửa chữa',
		},
	])

	return (
		<>
			<Dialog
				scroll="paper"
				open={isOpen}
				onClose={handleClose}
				fullScreen
				PaperProps={{ style: { maxWidth: 'unset' } }}
			>
				<DialogTitle textAlign="left">
					<b>Chi tiết thiết bị</b>

					<IconButton
						aria-label="close"
						onClick={handleClose}
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
				<DialogContent>
					<Box px={2} pb={5} height="100%">
						<DataGrid
							dataSource={dataSource}
							ref={dataGridRef}
							id="gridContainer"
							showBorders={true}
							columnAutoWidth={true}
							allowColumnResizing={true}
							columnResizingMode="widget"
							columnMinWidth={100}
							searchPanel={{
								visible: true,
								width: 240,
								placeholder: 'Tìm kiếm',
							}}
							editing={{
								confirmDelete: true,
								allowDeleting: true,
								allowAdding: true,
								allowUpdating: true,
							}}
							elementAttr={{ style: 'height: 100%; padding-bottom: 20px; width: 100%; min-width: 600px' }}
						>
							<ColumnChooser enabled={true} mode="select" />
							<Paging enabled={true} />
							<FilterRow visible={true} applyFilter={true} />
							<HeaderFilter visible={true} />
							<ColumnFixing enabled={true} />
							<Grouping contextMenuEnabled={true} expandMode="rowClick" />
							<FilterPanel visible={true} />
							<Pager
								allowedPageSizes={true}
								showInfo={true}
								showNavigationButtons={true}
								showPageSizeSelector={true}
								visible={true}
							/>
							<LoadPanel enabled={true} />
							<Paging defaultPageSize={30} />
							{commonFieldsShow.map(col => (
								<Column
									key={col.id}
									dataField={col.id}
									dataType="string"
									headerCellRender={data => renderHeader(data)}
									caption={col.header}
									fixed={col?.fixed}
									cellRender={data => (
										<span>
											{Number(data.text) && col?.type === 'date'
												? moment.unix(Number(data.text)).format('DD/MM/YYYY')
												: data.text}
										</span>
									)}
								/>
							))}

							<Column type="buttons">
								{[
									'Admin',
									'Trưởng phòng TT TNTH',
									'Chuyên viên TT TNTH',
									'Trưởng đơn vị sử dụng',
									'Chuyên viên đơn vị sử dụng',
								].includes(owner.GroupName) && (
									<DevButtonGrid
										icon="edit"
										onClick={(e: any) => {
											console.log(e.row.data)
											handleOpenMaintenanceDialog(e.row.data.DeviceInfoId || '')
										}}
									/>
								)}
								<DevButtonGrid
									icon="clock"
									onClick={(e: any) => {
										handleOpenDeviceUsageHoursDialog(e.row.data.SerialNumber)
									}}
								/>
							</Column>
							<Toolbar>
								<Item name="columnChooserButton" />
								<Item name="searchPanel" showText="always" />
							</Toolbar>
						</DataGrid>
					</Box>
				</DialogContent>
			</Dialog>

			{isOpenMaintenance && (
				<DialogMaintenanceDevice
					isOpen={isOpenMaintenance}
					onClose={handleCloseMaintenanceDialog}
					data={maintenanceDevice}
					loading={loading}
				/>
			)}
			{isOpenDeviceUsageHours && (
				<DialogDeviceUsageHours isOpen={isOpenDeviceUsageHours} onClose={handleCloseDeviceUsageHoursDialog} />
			)}
		</>
	)
}

export default DeviceOfDepartmentTable
