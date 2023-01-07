import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
	Box,
	CircularProgress,
	debounce,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	IconButton,
	InputAdornment,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material';

import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IDeviceHistory } from '../../../types/deviceHistoriesType';
import { IDeviceTransferHistoryItem } from '../../../types/deviceTransferType';
import { IDeviceRecordUsageHours } from '../../../types/deviceUsageHoursType';
import {
	IInstrumentHistory,
	IInstrumentResearchItem,
	IInstrumentTranferItem,
} from '../../../types/instrumentHistoriesType';
import { IRepairDeviceItem } from '../../../types/maintenanceDevicesType';
import { descendingComparator, renderArrowSort } from '../../ChemicalWarehouseTable/Utils';
import { useDeviceOfDepartmentTableStore } from '../context/DeviceOfDepartmentTableContext';
import { removeAccents } from '../DeviceOfDepartmentTable';
import { ColumnSizeType, DeviceColumnType, DialogProps } from './DialogType';
import { nestedObject } from './ultis';

const DialogHistoryDevices = ({
	isOpen,
	onClose,
	data,
	loading,
}: DialogProps & {
	data: IDeviceHistory | IInstrumentHistory | null;
	loading: boolean;
}) => {
	const [historyDevice, setHistoryDevice] = useState<IDeviceHistory | IInstrumentHistory | null>(null);
	const [order, setOrder] = useState<string>('asc');
	const [orderBy, setOrderBy] = useState<string>('DeviceId');
	const [keyword, setKeyword] = useState<String | null>(null);
	const [typeTable, setTypeTable] = useState<string>('Giờ sử dụng');
	const typeDeviceTables = useRef<string[]>(['Giờ sử dụng', 'Điều chuyển', 'Bảo trì']);
	const typeInstrumentTables = useRef<string[]>(['Điều chuyển', 'Research', 'Thanh lý']);
	const { deviceType, listDeviceType } = useDeviceOfDepartmentTableStore();

	function isDeviceHistory(obj: any): obj is IDeviceHistory {
		if (obj !== null) return 'SerialNumber' in obj;
		return false;
	}

	function isInstrumentHistory(obj: any): obj is IInstrumentHistory {
		if (obj !== null) return 'InstrumentDeptId' in obj;
		return false;
	}

	useEffect(() => {
		setHistoryDevice(data);
		setKeyword('');
	}, [data]);

	useEffect(() => {
		if (!isOpen) {
			setHistoryDevice(null);
			setKeyword(null);
			setTypeTable('Giờ sử dụng');
			setOrderBy('asc');
		}
	}, [isOpen]);

	const historyDeviceColumns = useRef<(DeviceColumnType & { colSize: ColumnSizeType })[]>([
		{ id: 'DeviceId', header: `Mã ${deviceType}`, colSize: { sm: 3, xs: 12 } },
		{ id: 'SerialNumber', header: 'Số Serial', colSize: { sm: 3, xs: 12 } },
		{ id: 'Model', header: 'Số Model', colSize: { sm: 3, xs: 12 } },
		{ id: 'Origin', header: 'Xuất xứ', colSize: { sm: 3, xs: 12 } },
		{ id: 'DeviceName', header: 'Tên thiết bị', colSize: { sm: 6, xs: 12 } },
		{ id: 'ManufactureName', header: 'Nhà sản xuất', colSize: { sm: 6, xs: 12 } },
		{ id: 'DateReceive', header: 'Ngày nhận', colSize: { sm: 3, xs: 12 }, type: 'date' },
		{ id: 'DateStartUsage', header: 'Ngày sử dụng', colSize: { sm: 3, xs: 12 }, type: 'date' },
		{ id: 'HoursUsageTotal', header: 'Giờ đã sử dụng (giờ)', colSize: { sm: 3, xs: 12 } },
		{ id: 'SuggestId', header: 'SuggestId', colSize: { sm: 3, xs: 12 } },
		{ id: 'Location', header: 'Location', colSize: { sm: 6, xs: 12 } },
		{ id: 'Status', header: 'Trạng thái', colSize: { sm: 6, xs: 12 } },
		{ id: 'Standard', header: 'Qui cách', colSize: { sm: 12, xs: 12 } },
	]);

	const historyInstrumentColumns = useRef<(DeviceColumnType & { colSize: ColumnSizeType })[]>([
		{ id: 'DeviceId', header: `Mã deviceType`, colSize: { sm: 6, xs: 12 } },
		{ id: 'InstrumentDeptId', header: 'InstrumentDeptId', colSize: { sm: 6, xs: 12 } },
		{ id: 'DeviceName', header: `Tên ${deviceType}`, colSize: { xs: 12 } },
		{ id: 'Origin', header: 'Xuất xứ', colSize: { xs: 6 } },
		{ id: 'Unit', header: 'Đơn vị tính', colSize: { xs: 6 } },
		{ id: 'Standard', header: 'Qui cách', colSize: { xs: 12 } },
	]);

	const historyDeviceHourUsageColumns = useRef<DeviceColumnType[]>([
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
	]);

	const historyDeviceTranferColumns = useRef<DeviceColumnType[]>([
		{ id: 'LabId', header: 'Mã phòng' },
		{ id: 'LabName', header: 'Tên phòng' },
		{ id: 'Location', header: 'Địa chỉ' },
		{ id: 'DateTransfer', header: 'Ngày chuyển', type: 'date' },
		{ id: 'ExportLabId', header: 'Mã phiếu xuất' },
		{ id: 'EmployeeName', header: 'Người chuyển' },
	]);

	const historyDeviceMaintenanceColumns = useRef<DeviceColumnType[]>([
		{ id: 'RepairId', header: 'Mã bảo trì' },
		{ id: 'Content', header: 'Nội dung' },
		{ id: 'Cost', header: 'Giá' },
		{ id: 'DateCreate', header: 'Ngày bảo trì', type: 'date' },
		{ id: 'EmployeeName', header: 'Người yêu cầu bảo trì' },
		{ id: 'Status', header: 'Trạng thái' },
	]);

	const historyInstrumentTranferColumns = useRef<DeviceColumnType[]>([
		{ id: 'TransferId', header: 'EmployeeName' },
		{ id: 'LabId', header: 'LabId' },
		{ id: 'DateTransfer', header: 'Ngày chuyển', type: 'date' },
		{ id: 'LabIdReceive', header: 'LabIdReceive' },
		{ id: 'EmployeeName', header: 'EmployeeName' },
	]);

	const historyInstrumentResearchColumns = useRef<DeviceColumnType[]>([
		{ id: 'EmployeeId', header: 'EmployeeId' },
		{ id: 'EmployeeName', header: 'EmployeeName' },
		{ id: 'Quantity', header: 'Quantity' },
		{ id: 'ExpResearchId', header: 'ExpResearchId' },
	]);

	// const historyLiquitedateResearchColumns = useRef<DeviceColumnType[]>([
	// 	{ id: 'EmployeeId', header: 'EmployeeId' },
	// 	{ id: 'EmployeeName', header: 'EmployeeName' },
	// 	{ id: 'Quantity', header: 'Quantity' },
	// 	{ id: 'ExpResearchId', header: 'ExpResearchId' },
	// ]);

	const handleRequestSort = (property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const getColumnActive = useCallback(
		(type: string) => {
			let headerCol: DeviceColumnType[] = [];
			let list:
				| IRepairDeviceItem[]
				| IDeviceTransferHistoryItem[]
				| IDeviceRecordUsageHours[]
				| IInstrumentTranferItem[]
				| IInstrumentResearchItem[] = [];

			if (deviceType === listDeviceType[0]) {
				switch (type) {
					case typeDeviceTables.current[0]: {
						headerCol = historyDeviceHourUsageColumns.current;
						if (isDeviceHistory(historyDevice)) {
							list =
								historyDevice?.listHourUsage
									.sort(
										(a: IDeviceRecordUsageHours, b: IDeviceRecordUsageHours) =>
											Number(b.DateInput) - Number(a.DateInput),
									)
									.filter(item => {
										if (keyword?.trim() === '') return true;

										let searchString: String = '';

										searchString = nestedObject(item, searchString);
										searchString = removeAccents(searchString.toUpperCase());

										return searchString.includes(`${keyword}`);
									}) || [];
						}
						break;
					}
					case typeDeviceTables.current[1]: {
						headerCol = historyDeviceTranferColumns.current;
						if (isDeviceHistory(historyDevice)) {
							list =
								historyDevice?.listDeviceTransfer
									.sort(
										(a: IDeviceTransferHistoryItem, b: IDeviceTransferHistoryItem) =>
											Number(b.DateTransfer) - Number(a.DateTransfer),
									)
									.filter(item => {
										if (keyword?.trim() === '') return true;

										let searchString: String = '';

										searchString = nestedObject(item, searchString);
										searchString = removeAccents(searchString.toUpperCase());

										return searchString.includes(`${keyword}`);
									}) || [];
						}
						break;
					}
					case typeDeviceTables.current[2]: {
						headerCol = historyDeviceMaintenanceColumns.current;
						if (isDeviceHistory(historyDevice)) {
							list =
								historyDevice?.listMaintenance
									.sort(
										(a: IRepairDeviceItem, b: IRepairDeviceItem) =>
											Number(b.DateCreate) - Number(a.DateCreate),
									)
									.filter(item => {
										if (keyword?.trim() === '') return true;

										let searchString: String = '';
										searchString = nestedObject(item, searchString);
										searchString = removeAccents(searchString.toUpperCase());

										return searchString.includes(`${keyword}`);
									}) || [];
						}
						break;
					}
					default:
						break;
				}
			}

			if (deviceType !== listDeviceType[0]) {
				switch (type) {
					case typeInstrumentTables.current[0]: {
						headerCol = historyInstrumentTranferColumns.current;
						if (isInstrumentHistory(historyDevice)) {
							list =
								historyDevice?.listInstrumentTranfer
									.sort(
										(a: IInstrumentTranferItem, b: IInstrumentTranferItem) =>
											Number(b.DateTransfer) - Number(a.DateTransfer),
									)
									.filter(item => {
										if (keyword?.trim() === '') return true;

										let searchString: String = '';
										searchString = nestedObject(item, searchString);
										searchString = removeAccents(searchString.toUpperCase());

										return searchString.includes(`${keyword}`);
									}) || [];
						}
						break;
					}
					case typeInstrumentTables.current[1]: {
						headerCol = historyInstrumentResearchColumns.current;
						if (isInstrumentHistory(historyDevice)) {
							list =
								historyDevice?.listInstrumentResearch
									.sort((a: IInstrumentResearchItem, b: IInstrumentResearchItem) => {
										if (a.ExpResearchId < b.ExpResearchId) {
											return -1;
										}
										if (a.ExpResearchId > b.ExpResearchId) {
											return 1;
										}
										return 0;
									})
									.filter(item => {
										if (keyword?.trim() === '') return true;

										let searchString: String = '';
										searchString = nestedObject(item, searchString);
										searchString = removeAccents(searchString.toUpperCase());

										return searchString.includes(`${keyword}`);
									}) || [];
						}
						break;
					}
					default:
						break;
				}
			}

			list = list.sort((a, b) => {
				let i: any =
					order === 'desc'
						? descendingComparator<any>(a, b, orderBy)
						: -descendingComparator<any>(a, b, orderBy);
				return i;
			});

			return { headerCol, list };
		},
		[order, orderBy, keyword],
	);

	const renderTableHeader = (type: string) => {
		let { headerCol } = getColumnActive(type);

		return headerCol?.map(col => (
			<TableCell
				key={col.id}
				sx={{ background: '#d3d3d3', width: `${col?.size}px` }}
				onClick={() => handleRequestSort(col.id)}
			>
				{col.header}{' '}
				<span
					style={{
						fontSize: '16px',
					}}
				>
					{renderArrowSort(order, orderBy, col.id)}
				</span>
			</TableCell>
		));
	};

	const renderTableBody = (type: string) => {
		const { headerCol, list } = getColumnActive(type);

		return (
			<>
				{list?.length === 0 && (
					<TableRow>
						<TableCell colSpan={headerCol.length} sx={{ borderBottom: '0', textAlign: 'center' }}>
							<h3 style={{ width: '100%', padding: '16px 0px' }}>Trống</h3>
						</TableCell>
					</TableRow>
				)}
				{list?.map((device, index) => {
					return (
						<TableRow key={`${index}`} sx={{ position: 'relative' }}>
							{headerCol.map(col => {
								if (col.type === 'date')
									return (
										<TableCell key={col.id}>
											{moment
												.unix(Number(device[col.id as keyof typeof device]))
												.format('DD/MM/YYYY')}
										</TableCell>
									);
								if (col.id === 'Cost')
									return (
										<TableCell key={col.id}>
											{Number(device[col.id as keyof typeof device]).toLocaleString('vi-VN')}
										</TableCell>
									);
								return (
									<TableCell key={col.id}>{`${
										device[col.id as keyof typeof device] === null
											? ''
											: device[col.id as keyof typeof device]
									}`}</TableCell>
								);
							})}
						</TableRow>
					);
				})}
			</>
		);
	};

	const renderStaticField = () => {
		let fields: (DeviceColumnType & { colSize: ColumnSizeType })[] =
			deviceType === listDeviceType[0] ? historyDeviceColumns.current : historyInstrumentColumns.current;

		return fields.map(col => {
			if (col.type === 'date')
				return (
					<Grid item {...col.colSize} key={col.id}>
						<TextField
							fullWidth
							InputProps={{
								readOnly: true,
							}}
							variant="standard"
							value={moment
								.unix(
									Number(
										historyDevice !== null && historyDevice[col.id as keyof typeof historyDevice],
									),
								)
								.format('DD/MM/YYYY')}
							label={col.header}
						/>
					</Grid>
				);

			if (col.id === 'Standard')
				return (
					<Grid item {...col.colSize} key={col.id}>
						<TextField
							fullWidth
							multiline
							rows={2}
							InputProps={{
								readOnly: true,
							}}
							variant="standard"
							value={
								historyDevice !== null && (historyDevice[col.id as keyof typeof historyDevice] || ' ')
							}
							label={col.header}
						/>
					</Grid>
				);
			return (
				<Grid item {...col.colSize} key={col.id}>
					<TextField
						fullWidth
						InputProps={{
							readOnly: true,
						}}
						variant="standard"
						value={historyDevice !== null && (historyDevice[col.id as keyof typeof historyDevice] || ' ')}
						label={col.header}
					/>
				</Grid>
			);
		});
	};

	return (
		<Dialog open={isOpen} onClose={onClose} PaperProps={{ style: { width: '800px', maxWidth: 'unset' } }}>
			<DialogTitle textAlign="left">
				<b>Lịch sử thiết bị</b>

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
			<DialogContent>
				{!loading ? (
					<>
						<Grid container spacing={2}>
							{renderStaticField()}
							<Grid item xs={12}>
								<Divider />
							</Grid>
						</Grid>

						<Grid container spacing={2} my={1}>
							<Grid item xs={12} sm={6}>
								<TextField
									sx={{
										height: '100%',
										alignItems: 'flex-end',
										justifyContent: 'end',
									}}
									fullWidth
									type="search"
									size="small"
									placeholder="Tìm kiếm...."
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchIcon />
											</InputAdornment>
										),
									}}
									variant="standard"
									onChange={debounce(
										e => setKeyword(removeAccents(e.target.value.toUpperCase())),
										300,
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									select
									label="Loại"
									fullWidth
									variant="standard"
									defaultValue={
										deviceType === listDeviceType[0]
											? typeDeviceTables.current[0]
											: typeDeviceTables.current[0]
									}
									onChange={e => {
										setTypeTable(e.target.value);
									}}
								>
									{deviceType === listDeviceType[0] &&
										typeDeviceTables.current.map(option => (
											<MenuItem key={option} value={option}>
												{option}
											</MenuItem>
										))}
									{deviceType !== listDeviceType[0] &&
										typeInstrumentTables.current.map(option => (
											<MenuItem key={option} value={option}>
												{option}
											</MenuItem>
										))}
								</TextField>
							</Grid>
						</Grid>

						<TableContainer
							component={Paper}
							sx={{
								minHeight: {
									xs: '280px',
								},
							}}
						>
							<Table stickyHeader size="small" sx={{ minWidth: '600px' }}>
								<TableHead>{<TableRow>{renderTableHeader(typeTable)}</TableRow>}</TableHead>
								{<TableBody>{renderTableBody(typeTable)}</TableBody>}
							</Table>
						</TableContainer>
					</>
				) : (
					<Box textAlign="center">
						<CircularProgress disableShrink />
					</Box>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default DialogHistoryDevices;
