import styled from '@emotion/styled';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import {
	AppBar,
	Autocomplete,
	Button,
	CircularProgress,
	Collapse,
	debounce,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Select,
	SelectChangeEvent,
	Stack,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { MRT_Row } from 'material-react-table';
import { memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SearchIcon from '@mui/icons-material/Search';
import { IDeviceDepartmentType, IDeviceDeptType, dummyDeviceDepartmentData } from '../../types/deviceDepartmentType';
import * as API from '../../configs/apiHelper';
import { IDepartmentType } from '../../types/departmentType';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { deleteDevice, getDevices, postDevice, updateDevice } from '../../services/deviveDepartmentServices';
import moment from 'moment';
import { DeviceType } from '../../configs/enums';
import CloseIcon from '@mui/icons-material/Close';
import { setSnackbarMessage } from '../../pages/appSlice';
import { IExportDeviceType } from '../../types/exportDeviceType';
import { DialogCreate, DialogDelete } from './Dialog';

const StyledTableCell = styled(TableCell)(theme => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: 'lightgray',
	},
}));

type DeviceTableProps = {
	id: Number | undefined;
};

type DeviceColumnType = {
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
		return order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;
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
	const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
	const [deviceType, setDeviceType] = useState<string>('Thiết bị');
	const listDeviceType = useRef(['Thiết bị', 'Công cụ', 'Dụng cụ']);
	const [deviceData, setDeviceData] = useState<any>({});
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [loading, setLoading] = useState<Boolean>(true);

	const [updatedRow, setUpdatedRow] = useState<any>();
	const [deletedRow, setDeletedRow] = useState<IDeviceDepartmentType>();

	useEffect(() => {
		const getDeviceData = async () => {
			try {
				const data: IDeviceDepartmentType[] = await getDevices(id || 0, deviceType);

				if (!deviceData[deviceType]) {
					deviceData[deviceType] = data;
					setDeviceData({ ...deviceData });
				}
				if(Array.isArray(data)) {
					setDevices(data || []);
					setCloneDevices(data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		getDeviceData();
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
				id: device.ExpDeviceDeptId,
			};
		});
		setDataSearch(data);
	}, [devices]);

	useEffect(() => {
		const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);

		if (keyword === '') {
			setDevices(cloneDevices || []);
		} else {
			const data = devices.filter((x: any) => listId.indexOf(x?.ExpDeviceDeptId) !== -1);
			setDevices(data || []);
		}
	}, [keyword]);

	const handleOpenCreate = () => {
		setIsOpenCreateModal(true);
	};

	const handleOpenEdit = () => {
		setIsOpenEditModal(true);
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
		{ id: 'DeviceDetailId', header: 'Mã chi tiết TB' },
		{ id: 'DeviceId', header: 'Mã thiết bị' },
		{ id: 'DeviceName', header: 'Tên thiết bị' },
		{ id: 'Standard', header: 'Qui cách' },
		{ id: 'HasTrain', header: 'Đã tập huấn' },
		{ id: 'QuantityOriginal', header: 'SL ban đầu' },
		{ id: 'QuantityExport', header: 'SL xuất' },
		{ id: 'QuantityRemain', header: 'SL tồn' },
	]);

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	return (
		<>
			<Box component="div" justifyContent="space-between" display="flex" flexWrap='wrap' mx={8} mb={2}>
				<Typography fontWeight="bold" variant="h6" whiteSpace='nowrap'>
					Bảng {deviceType}
				</Typography>
				<Box display="flex" alignItems="end" flexWrap="wrap" justifyContent="flex-end">
					<Box>
						<FormControl>
							<RadioGroup
								aria-labelledby="radio-buttons-group-label"
								defaultValue={listDeviceType.current[0]}
								name="radio-buttons-group"
								sx={{ display: 'flex', flexDirection: 'row' }}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setDeviceType((event.target as HTMLInputElement).value);
								}}
							>
								{listDeviceType.current.map((type: string) => (
									<FormControlLabel
										value={type}
										control={<Radio />}
										label={type}
										key={type}
										checked={type === deviceType}
									/>
								))}
							</RadioGroup>
						</FormControl>

						<TextField
							id="filled-search"
							type="search"
							variant="standard"
							placeholder="Tìm kiếm..."
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon />
									</InputAdornment>
								),
							}}
							onChange={debounce(e => setKeyword(removeAccents(e.target.value.toUpperCase())), 300)}
						/>

						<Tooltip arrow placement="left" title="Sửa">
							<Button variant="contained" onClick={handleOpenCreate} sx={{ marginLeft: '24px' }}>
								<AddIcon />
							</Button>
						</Tooltip>
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
								<StyledTableCell align="left" onClick={() => handleRequestSort(col.id)}>
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
							devices?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								?.map((exportDevice: IDeviceDepartmentType, index: number) => (
									<RowDevice
										device={exportDevice}
										index={index}
										key={index}
										handleOpenDelete={handleOpenDelete}
										handleOpenEdit={handleOpenEdit}
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
		</>
	);
};

type RowDeviceProps = {
	handleOpenEdit: (exportDevice: any) => void;
	handleOpenDelete: (exportDevice: any) => void;
	device: IDeviceDepartmentType;
	index: number;
};

const RowDevice = ({ index, device, handleOpenEdit, handleOpenDelete }: RowDeviceProps) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& > *': { borderBottom: 'unset' } }}>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell align="left">{index + 1}</TableCell>
				<TableCell align="left">{device?.DeviceDetailId}</TableCell>
				<TableCell align="left">{device?.DeviceId}</TableCell>
				<TableCell align="left">{device?.DeviceName}</TableCell>
				<TableCell align="left">{device?.HasTrain}</TableCell>
				<TableCell align="left">
					{device?.QuantityExport?.toString()} {`(${device?.Unit})`}
				</TableCell>
				<TableCell align="left">
					{device?.QuantityOriginal?.toString()} {`(${device?.Unit})`}
				</TableCell>
				<TableCell align="left">
					{device?.QuantityRemain?.toString()} {`(${device?.Unit})`}
				</TableCell>
				<TableCell align="left">{device?.Standard}</TableCell>
				{/* <TableCell align="right" size="small">
					<Tooltip arrow placement="left" title="Sửa">
						<IconButton onClick={() => handleOpenEdit(device)}>
							<Edit />
						</IconButton>
					</Tooltip>
					<Tooltip arrow placement="right" title="Xoá">
						<IconButton color="error" onClick={() => handleOpenDelete(device)}>
							<Delete />
						</IconButton>
					</Tooltip>
				</TableCell> */}
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0, background: '#f3f3f3' }} colSpan={12}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							{device?.listExportDevice?.length !== 0 ? (
								<>
									<Typography variant="h6" gutterBottom component="div">
										Chi tiết thiết bị
									</Typography>
									<DeviceDetailTable data={device?.listExportDevice || []} unit={device.Unit} />
								</>
							) : (
								<Typography variant="h5" gutterBottom align="center" component="div">
									Trống
								</Typography>
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
};

const DeviceDetailTable = ({ data, unit }: DeviceDetailTableProps) => {
	const [deviceDetails, setDeviceDetails] = useState<IExportDeviceType[]>([]);
	const [order, setOrder] = useState<string>('asc');
	const [orderBy, setOrderBy] = useState<string>('DeviceId');

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

	const columns = useRef([
		{ id: 'ExpDeviceDeptId', header: 'Mã' },
		{ id: 'LabName', header: 'Phòng' },
		{ id: 'Location', header: 'Địa chỉ' },
		{ id: 'ExportDate', header: 'Ngày xuất', type: 'date' },
		{ id: 'EmployeeName', header: 'Người xuất' },
		{ id: 'SerialNumber', header: 'Số Serial' },
		{ id: 'ManufacturingDate', header: 'Ngày sản xuất', type: 'date' },
		{ id: 'StartGuarantee', header: 'Bắt đầu bảo hành', type: 'date' },
		{ id: 'EndGuarantee', header: 'Kết thúc bảo hành', type: 'date' },
		{ id: 'YearStartUsage', header: 'Năm sử dụng' },
		{ id: 'HoursUsage', header: 'Giờ sử dụng' },
	]);

	return (
		<>
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
							return (
								<TableRow key={index}>
									{columns.current.map(col => {
										if (col.type === 'date')
											return (
												<TableCell align="left" key={col.id}>
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
										return (
											<TableCell align="left">
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
