import styled from '@emotion/styled';
import AddIcon from '@mui/icons-material/Add';
import {
	Button,
	CircularProgress,
	Collapse,
	debounce,
	FormControl,
	FormControlLabel,
	IconButton,
	InputAdornment,
	Paper,
	Radio,
	RadioGroup,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import moment from 'moment';
import { setSnackbarMessage } from '../../pages/appSlice';
import { deleteDevice, getDevices } from '../../services/deviveDepartmentServices';
import { IDeviceDepartmentType } from '../../types/deviceDepartmentType';
import { IExportDeviceType } from '../../types/exportDeviceType';
import { DialogCreate, DialogDelete, DialogDeviceUsageHours } from './Dialog';

const listDeviceType = ['Thiết bị', 'Công cụ', 'Dụng cụ'];

const StyledTableCell = styled(TableCell)(theme => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: 'lightgray',
	},
}));

const FormControlStyled = styled(FormControl)(theme => ({
	'@media (max-width: 600px)': {
		width: '100%',
	},
}));

const BoxTextFieldStyled = styled(Box)(theme => ({
	'@media (max-width: 600px)': {
		width: '100%',
		margin: '8px 0'
	},

	'@media (max-width: 900px)': {
		margin: '8px 0'
	},
}));

type DeviceTableProps = {
	id: Number | undefined;
};

export type DeviceColumnType = {
	id: string;
	header: String;
	type?: string;
	data?: any;
	size?: number;
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function renderArrowSort(order: string, orderBy: string, property: string) {
	if (orderBy === property) {
		return order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
	}
	return null;
}

function removeAccents(str: string) {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D');
}

const isObject = (val: any) => {
	if (val === null) {
		return false;
	}

	return typeof val === 'object';
};

const nestedObject = (obj: any, string: String) => {
	for (const key in obj) {
		if (isObject(obj[key])) {
			nestedObject(obj[key], string);
		} else {
			switch (key) {
				case 'ExportDate':
				case 'ManufacturingDate':
				case 'StartGuarantee':
				case 'EndGuarantee':
				case 'DateTranferTo':
				case 'DateStartUsage':
					string += `${moment.unix(Number(obj[key])).format('DD/MM/YYYY')} `;
					break;
				default:
					string += `${obj[key]} `;
					break;
			}
		}
	}
	return string;
};

const DeviceOfDepartmentTable = ({ id }: DeviceTableProps) => {
	const warehouseLaboratoriesData = useAppSelector((state: RootState) => state.warehouse.listOfWarehouseLaboratory);
	const dispatch = useAppDispatch();
	const [devices, setDevices] = useState<IDeviceDepartmentType[]>([]);
	const [order, setOrder] = useState<string>('asc');
	const [orderBy, setOrderBy] = useState<string>('DeviceId');
	const [keyword, setKeyword] = useState<string>('');
	const [dataSearch, setDataSearch] = useState<any>([]);
	const [cloneDevices, setCloneDevices] = useState<IDeviceDepartmentType[]>([]);
	const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
	const [isOpenDeviceUsageHours, setIsOpenDeviceUsageHours] = useState<boolean>(false);
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
	const [deviceType, setDeviceType] = useState<string>('Thiết bị');
	const [deviceData, setDeviceData] = useState<any>({});
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [loading, setLoading] = useState<Boolean>(true);
	const [open, setOpen] = useState<number>(-1);
	const [updatedRow, setUpdatedRow] = useState<any>();
	const [deletedRow, setDeletedRow] = useState<IDeviceDepartmentType>();

	const getDeviceData = async () => {
		try {
			setLoading(true);
			const data: IDeviceDepartmentType[] = await getDevices(id || 0, deviceType);

			if (!deviceData[deviceType]) {
				deviceData[deviceType] = data;
				setDeviceData({ ...deviceData });
			}
			if (Array.isArray(data)) {
				setDevices(data || []);
				setCloneDevices(data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getDeviceData();
		setKeyword('');
	}, [deviceType]);

	const handleRequestSort = (property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	useEffect(() => {
		setDevices(prev => {
			let data = [...prev];
			data?.sort((a: IDeviceDepartmentType, b: IDeviceDepartmentType) => {
				let i =
					order === 'desc'
						? descendingComparator<any>(a, b, orderBy)
						: -descendingComparator<any>(a, b, orderBy);
				return i;
			});
			return data || [];
		});
	}, [order, orderBy]);

	useEffect(() => {
		const data = devices.map((device: any) => {
			let string: String = '';

			const isObject = (val: any) => {
				if (val === null) {
					return false;
				}

				return typeof val === 'object';
			};

			const nestedObject = (obj: any) => {
				for (const key in obj) {
					if (isObject(obj[key])) {
						nestedObject(obj[key]);
					} else {
						switch (key) {
							case 'ExportDate':
							case 'ManufacturingDate':
							case 'StartGuarantee':
							case 'EndGuarantee':
							case 'DateTranferTo':
							case 'DateStartUsage':
								string += `${moment.unix(Number(obj[key])).format('DD/MM/YYYY')} `;
								break;
							default:
								string += `${obj[key]} `;
								break;
						}
					}
				}
			};

			nestedObject(device);

			return {
				label: removeAccents(string.toUpperCase()),
				id: device.DeviceDetailId,
			};
		});
		setDataSearch(data);
	}, [devices]);

	useEffect(() => {
		const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);

		if (keyword === '') {
			setDevices(cloneDevices || []);
		} else {
			const data = devices.filter((x: any) => listId.indexOf(x?.DeviceDetailId) !== -1);
			setDevices(data || []);
		}
	}, [keyword]);

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleOpenCreate = () => {
		setIsOpenCreateModal(true);
	};

	const handleOpenEdit = () => {
		setIsOpenEditModal(true);
	};

	const handleDeviceUsageHours = () => {
		setIsOpenDeviceUsageHours(true);
	};

	const handleOpenDelete = (dataDelete: IDeviceDepartmentType) => {
		setIsOpenDeleteModal(true);
		setDeletedRow(dataDelete);
	};

	const handleSubmitDelete = async (DeviceId: String) => {
		try {
			const data = await deleteDevice(DeviceId);

			if (data) {
				dispatch(setSnackbarMessage('Xóa thông tin thành công'));
				const newData = deviceData[deviceType]?.filter((device: any) => DeviceId !== device?.DeviceId);
				setDeviceData({
					...deviceData,
					[deviceType]: newData,
				});
				setDevices(newData || []);
				setCloneDevices(newData || []);
			} else {
				dispatch(setSnackbarMessage('Xóa thông tin không thành công'));
			}
		} catch (error) {
			dispatch(setSnackbarMessage('Xóa thông tin không thành công'));
		} finally {
			setIsOpenDeleteModal(true);
		}
	};

	const columns = useRef([
		{ id: 'DeviceDeptId', header: 'Mã chi tiết TB' },
		{ id: 'DeviceId', header: 'Mã thiết bị' },
		{ id: 'DeviceName', header: 'Tên thiết bị' },
		{ id: 'Standard', header: 'Qui cách' },
		{ id: 'HasTrain', header: 'Đã tập huấn' },
		{ id: 'QuantityOriginal', header: 'SL ban đầu' },
		{ id: 'QuantityExport', header: 'SL xuất' },
		{ id: 'QuantityRemain', header: 'SL tồn' },
		{ id: 'QuantityLiquidate', header: 'SL thanh lý' },
	]);

	return (
		<>
			<Box component="div" justifyContent="space-between" display="flex" flexWrap="wrap" mx={2} mb={2}>
				<Typography fontWeight="bold" variant="h6" whiteSpace="nowrap">
					Bảng {deviceType}
				</Typography>
				<Box display="flex" alignItems="end" flexWrap="wrap" justifyContent="flex-end">
					<Box display="flex" alignItems="end" flexWrap="wrap" justifyContent="flex-end">
						<FormControlStyled>
							<RadioGroup
								aria-labelledby="radio-buttons-group-label"
								defaultValue={listDeviceType[0]}
								name="radio-buttons-group"
								sx={{ display: 'flex', flexDirection: 'row' }}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setDeviceType((event.target as HTMLInputElement).value);
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
						<BoxTextFieldStyled>
							<TextField
								id="filled-search"
								type="search"
								variant="standard"
								placeholder="Tìm kiếm..."
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}}
								onChange={debounce(e => setKeyword(removeAccents(e.target.value.toUpperCase())), 300)}
							/>
						</BoxTextFieldStyled>
						<Box>
							<Tooltip arrow placement="left" title="Tạo mới">
								<Button variant="contained" onClick={handleOpenCreate} sx={{ marginLeft: '24px' }}>
									Tạo mới
								</Button>
							</Tooltip>
							<Tooltip arrow placement="left" title="Nhập giờ thiết bị">
								<Button
									variant="contained"
									onClick={handleDeviceUsageHours}
									sx={{ marginLeft: '24px' }}
								>
									Nhập giờ thiết bị
								</Button>
							</Tooltip>
						</Box>
					</Box>
					<TablePagination
						sx={{ width: '100%' }}
						rowsPerPageOptions={[10, 20, 40, 100]}
						component="div"
						count={devices?.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Box>
			</Box>
			<TableContainer component={Paper} sx={{ marginBottom: '24px', overflow: 'overlay' }}>
				<Table sx={{ minWidth: 900 }} stickyHeader size="small">
					<TableHead>
						<TableRow>
							<StyledTableCell align="left"></StyledTableCell>
							<StyledTableCell align="left">
								<b>#</b>
							</StyledTableCell>
							{columns.current.map(col => (
								<StyledTableCell align="left" key={col.id} onClick={() => handleRequestSort(col.id)}>
									<b>{col.header}</b>
									{renderArrowSort(order, orderBy, col.id)}
								</StyledTableCell>
							))}

							{/* <StyledTableCell align="right">
								<b>Hành động</b>
							</StyledTableCell> */}
						</TableRow>
					</TableHead>
					<TableBody>
						{!loading &&
							devices
								?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								?.map((exportDevice: IDeviceDepartmentType, index: number) => (
									<RowDevice
										deviceType={deviceType}
										device={exportDevice}
										index={index}
										key={index}
										handleOpenDelete={handleOpenDelete}
										handleOpenEdit={handleOpenEdit}
										handleOpen={(index: number) => setOpen(open === index ? -1 : index)}
										openIndex={open}
									/>
								))}
						{loading && (
							<TableRow>
								<TableCell colSpan={10} sx={{ textAlign: 'center' }}>
									<CircularProgress disableShrink />
								</TableCell>
							</TableRow>
						)}
						{!loading && devices?.length === 0 && (
							<TableRow>
								<TableCell colSpan={10} sx={{ textAlign: 'center' }}>
									<Typography variant="h5" gutterBottom align="center" component="div">
										Trống
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<DialogCreate isOpen={isOpenCreateModal} onClose={() => setIsOpenCreateModal(false)} />
			<DialogDelete
				isOpen={isOpenDeleteModal}
				onClose={() => setIsOpenDeleteModal(false)}
				dataDelete={deletedRow}
				handleSubmitDelete={handleSubmitDelete}
			/>

			<DialogDeviceUsageHours isOpen={isOpenDeviceUsageHours} onClose={() => setIsOpenDeviceUsageHours(false)} />
		</>
	);
};

type RowDeviceProps = {
	handleOpenEdit: (exportDevice: any) => void;
	handleOpenDelete: (exportDevice: any) => void;
	device: IDeviceDepartmentType;
	index: number;
	openIndex: number;
	handleOpen: (index: number) => void;
	deviceType: string;
};

const RowDevice = ({
	index,
	device,
	handleOpenEdit,
	handleOpenDelete,
	handleOpen,
	openIndex,
	deviceType,
}: RowDeviceProps) => {
	return (
		<>
			<TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& > *': { borderBottom: 'unset' } }}>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => handleOpen(index)}>
						{openIndex === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell align="left">{index + 1}</TableCell>
				<TableCell align="left">{device?.DeviceDetailId}</TableCell>
				<TableCell align="left">{device?.DeviceId}</TableCell>
				<TableCell align="left">{device?.DeviceName}</TableCell>
				<TableCell align="left">{device?.Standard}</TableCell>
				<TableCell align="left">{device?.HasTrain}</TableCell>
				<TableCell align="left">
					{device?.QuantityOriginal?.toString()} {`(${device?.Unit})`}
				</TableCell>
				<TableCell align="left">
					{device?.QuantityExport?.toString()} {`(${device?.Unit})`}
				</TableCell>
				<TableCell align="left">
					{device?.QuantityRemain?.toString()} {`(${device?.Unit})`}
				</TableCell>
				<TableCell align="left">
					{device?.QuantityLiquidate?.toString()} {`(${device?.Unit})`}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0, background: '#f3f3f3' }} colSpan={12}>
					<Collapse in={openIndex === index} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							{device?.listExportDevice?.length !== 0 && deviceType === listDeviceType[0] ? (
								<>
									<DeviceDetailTable
										data={device?.listExportDevice || []}
										unit={device.Unit}
										deviceType={deviceType}
									/>
								</>
							) : (
								deviceType === listDeviceType[0] && (
									<Typography variant="h5" gutterBottom align="center" component="div">
										Trống
									</Typography>
								)
							)}

							{device?.listExportInstrument?.length !== 0 &&
							(deviceType === listDeviceType[1] || deviceType === listDeviceType[2]) ? (
								<>
									<DeviceDetailTable
										data={device?.listExportInstrument || []}
										unit={device.Unit}
										deviceType={deviceType}
									/>
								</>
							) : (
								(deviceType === listDeviceType[1] || deviceType === listDeviceType[2]) && (
									<Typography variant="h5" gutterBottom align="center" component="div">
										Trống
									</Typography>
								)
							)}
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

type DeviceDetailTableProps = {
	data: IExportDeviceType[];
	unit: String;
	deviceType: string;
};

const DeviceDetailTable = ({ data, unit, deviceType }: DeviceDetailTableProps) => {
	const [deviceDetails, setDeviceDetails] = useState<IExportDeviceType[]>([]);
	const [order, setOrder] = useState<string>('asc');
	const [orderBy, setOrderBy] = useState<string>('DeviceDeptId');
	const [keyword, setKeyword] = useState<string>('');
	const [dataSearch, setDataSearch] = useState<any>([]);

	useEffect(() => {
		setDeviceDetails(data);
	}, [data]);

	const handleRequestSort = (property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	useEffect(() => {
		setDeviceDetails(prev => {
			let data = [...prev];
			data?.sort((a: IExportDeviceType, b: IExportDeviceType) => {
				let i =
					order === 'desc'
						? descendingComparator<any>(a, b, orderBy)
						: -descendingComparator<any>(a, b, orderBy);
				return i;
			});
			return data;
		});
	}, [order, orderBy]);

	useEffect(() => {
		const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);

		if (keyword === '') {
			setDeviceDetails(data || []);
		} else {
			const results = data?.filter(x => listId.indexOf(x?.SerialNumber) !== -1);
			setDeviceDetails(results || []);
		}
	}, [keyword]);

	useEffect(() => {
		const searchArr = data?.map((device: any) => {
			let string: String = '';
			string = nestedObject(device, string);
			return {
				label: removeAccents(string.toUpperCase()),
				id: device.SerialNumber,
			};
		});
		setDataSearch(searchArr);
	}, [data]);

	const columns = useRef(
		(() => {
			if (deviceType === listDeviceType[1] || deviceType === listDeviceType[2])
				return [
					{ id: 'DeviceDeptId', header: 'Mã' },
					{
						id: 'LabName',
						header: 'Phòng',
						sx: { minWidth: '120px' },
						renderValue: (...args: String[]) => args.join(' - '),
					},
					{ id: 'Location', header: 'Địa chỉ', sx: { minWidth: '150px' } },
					{ id: 'Quantity', header: 'Số lượng' },
				];

			return [
				{ id: 'DeviceDeptId', header: 'Mã' },
				{
					id: 'LabName',
					header: 'Phòng',
					sx: { minWidth: '120px' },
					renderValue: (...args: String[]) => args.join(' - '),
				},
				{ id: 'Location', header: 'Địa chỉ', sx: { minWidth: '150px' } },
				{ id: 'DateTranferTo', header: 'Ngày nhập', type: 'date' },
				{ id: 'EmployeeName', header: 'Người xuất' },
				{ id: 'SerialNumber', header: 'Số Serial' },
				{ id: 'ManufacturingDate', header: 'Ngày sản xuất', type: 'date' },
				{ id: 'StartGuarantee', header: 'Bắt đầu bảo hành', type: 'date' },
				{ id: 'EndGuarantee', header: 'Kết thúc bảo hành', type: 'date' },
				{ id: 'DateStartUsage', header: 'Bắt đầu sử dụng', type: 'date' },
				{ id: 'HoursUsageTotal', header: 'Giờ sử dụng' },
				{ id: 'PeriodicMaintenance', header: 'Bảo dưỡng định kỳ' },
				{ id: 'Status', header: 'Trạng thái' },
				{ id: 'WarningMaintenace', header: 'Cảnh báo' },
			];
		})(),
	);

	return (
		<>
			<Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
				<Typography variant="h6" gutterBottom component="div" mb={0}>
					Chi tiết thiết bị
				</Typography>
				<TextField
					size="small"
					type="search"
					placeholder="Tìm kiếm...."
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
					variant="standard"
					onChange={debounce(e => setKeyword(removeAccents(e.target.value.toUpperCase())), 300)}
				/>
			</Box>
			<TableContainer component={Paper} sx={{ maxHeight: '400px', marginBottom: '24px', overflow: 'overlay' }}>
				<Table size="small" aria-label="purchases" sx={{ padding: '8px' }}>
					<TableHead>
						<TableRow>
							{columns.current.map(col => {
								return (
									<StyledTableCell
										key={col.id}
										align="left"
										onClick={() => handleRequestSort(col.id)}
									>
										<b>{col.header}</b>
										{renderArrowSort(order, orderBy, col.id)}
									</StyledTableCell>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{deviceDetails?.map((deviceDetailType: IExportDeviceType, index: number) => {
							let isWarning: boolean =
								deviceDetailType?.WarningMaintenace !== 'No warning' &&
								deviceType === listDeviceType[0];

							return (
								<TableRow
									key={index}
									sx={{
										background: isWarning ? '#fff3e0' : '',
									}}
								>
									{columns.current.map(col => {
										if (col.id === 'LabName') {
											return (
												<TableCell align="left" key={col.id} sx={{ ...(col?.sx || {}) }}>
													{col?.renderValue?.(
														deviceDetailType?.LabId || '',
														deviceDetailType?.LabName || '',
													) || ''}
												</TableCell>
											);
										}

										if (col.type === 'date')
											return (
												<TableCell align="left" key={col.id} sx={{ ...(col?.sx || {}) }}>
													{moment
														.unix(
															Number(
																deviceDetailType[
																	col.id as keyof typeof deviceDetailType
																],
															),
														)
														.format('DD/MM/YYYY')}
												</TableCell>
											);
										if (col.id === 'WarningMaintenace') {
											return (
												<TableCell align="left" key={col.id} sx={{ ...col?.sx }}>
													{isWarning && (
														<Tooltip
															title={
																<span style={{ color: '#663c00', fontSize: '12px' }}>
																	Cảnh báo tới hạn bảo dưỡng
																</span>
															}
															slotProps={{
																tooltip: {
																	sx: { background: '#fff4e5' },
																},
															}}
														>
															<span>
																<WarningIcon color="warning" />
															</span>
														</Tooltip>
													)}
												</TableCell>
											);
										}

										if (col.id === 'PeriodicMaintenance') {
											return (
												<TableCell align="left" key={col.id} sx={{ ...col?.sx }}>
													{deviceDetailType[col.id as keyof typeof deviceDetailType] !==
														null &&
														`${
															deviceDetailType[col.id as keyof typeof deviceDetailType]
														} tháng`}
												</TableCell>
											);
										}
										return (
											<TableCell align="left" key={col.id} sx={{ ...col?.sx }}>
												{deviceDetailType[col.id as keyof typeof deviceDetailType] !== null &&
													`${deviceDetailType[col.id as keyof typeof deviceDetailType]}`}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default DeviceOfDepartmentTable;
