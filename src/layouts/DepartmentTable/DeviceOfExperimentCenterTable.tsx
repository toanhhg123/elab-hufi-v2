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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SearchIcon from '@mui/icons-material/Search';
import {
	IDeviceDepartmentType,
	IDeviceDetailType,
	IDeviceDeptType,
	dummyDeviceDepartmentData,
} from '../../types/deviceDepartmentType';
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
import { DialogCreate, DialogDelete, DialogEdit } from './Dialog';

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
	renderValue?: (...args: any[]) => String;
	hide?: boolean;
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

const DeviceOfExperimentCenterTable = ({ id }: DeviceTableProps) => {
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
	const listDeviceType = useRef(Object.keys(DeviceType).filter(x => Number.isNaN(Number(x))));
	const [deviceData, setDeviceData] = useState<any>({});
	const [open, setOpen] = useState<number>(-1);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [loading, setLoading] = useState<Boolean>(true);

	const [updatedRow, setUpdatedRow] = useState<IDeviceDepartmentType>(dummyDeviceDepartmentData);
	const [deletedRow, setDeletedRow] = useState<IDeviceDepartmentType>(dummyDeviceDepartmentData);

	const getDeviceData = async () => {
		try {
			const data: IDeviceDepartmentType[] = await getDevices(id || 0, deviceType);

			if (!deviceData[deviceType]) {
				deviceData[deviceType] = data;
				setDeviceData({ ...deviceData });
			}

			setDevices(data || []);
			setCloneDevices(data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getDeviceData();
	}, [deviceType, isOpenCreateModal]);

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
							case 'OrderDate':
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
				id: device.DeviceId,
			};
		});
		setDataSearch(data);
	}, [devices]);

	useEffect(() => {
		const listId = dataSearch.filter((x: any) => x?.label?.includes(keyword)).map((y: any) => y.id);

		if (keyword === '') {
			setDevices(cloneDevices || []);
		} else {
			const data = devices.filter((x: any) => listId.indexOf(x?.DeviceId) !== -1);
			setDevices(data || []);
		}
	}, [keyword]);

	const handleOpenCreate = () => {
		setIsOpenCreateModal(true);
	};

	const handleOpenEdit = (device: IDeviceDepartmentType) => {
		setUpdatedRow(device);
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

	const handleSubmitUpdate = async (updatedRow: any) => {
		const updateData = {
			DeviceId: updatedRow?.DeviceId,
			DeviceName: updatedRow?.DeviceName,
			DeviceType: updatedRow?.DeviceType,
			Standard: updatedRow?.Standard,
			Unit: updatedRow?.Unit,
			HasTrain: updatedRow?.HasTrain === 'Có' ? 1 : 0,
		};

		const resData = await updateDevice(updateData);
		if (Object.keys(resData).length !== 0) {
			dispatch(setSnackbarMessage('Cập nhật thông tin thành công'));
			getDeviceData();
		} else {
			dispatch(setSnackbarMessage('Cập nhật thông tin không thành công'));
		}
		setIsOpenEditModal(false);
	};

	const columns = useRef<DeviceColumnType[]>([
		{ id: 'DeviceId', header: 'Mã thiết bị' },
		{ id: 'DeviceName', header: 'Tên thiết bị' },
		{ id: 'Standard', header: 'Qui cách' },
		{ id: 'QuantityOriginal', header: 'SL ban đầu', renderValue: (qty: any, unit: any) => `${qty} (${unit})` },
		{ id: 'QuantityExport', header: 'SL xuất', renderValue: (qty: any, unit: any) => `${qty} (${unit})` },
		{ id: 'QuantityRemain', header: 'SL tồn', renderValue: (qty: any, unit: any) => `${qty} (${unit})` },
		{ id: 'HasTrain', header: 'Tập huấn', renderValue: value => (value === 1 ? 'Có' : 'Không') },
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
			<Box component="div" justifyContent="space-between" display="flex" mx={8} mb={2}>
				<Typography fontWeight="bold" variant="h6">
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
						<Tooltip arrow placement="left" title="Tạo mới">
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
			<TableContainer component={Paper} sx={{ overflow: 'overlay', flex: '1', marginBottom: '24px' }}>
				<Table sx={{ minWidth: 900 }} stickyHeader size="small">
					<TableHead>
						<TableRow>
							<StyledTableCell align="left"></StyledTableCell>
							<StyledTableCell align="left">
								<b>#</b>
							</StyledTableCell>

							{columns.current.map(col => {
								return (
									<StyledTableCell
										align="left"
										onClick={() => handleRequestSort(col.id)}
										key={col.id}
									>
										<b>{col.header}</b>
										{renderArrowSort(order, orderBy, col.id)}
									</StyledTableCell>
								);
							})}
							<StyledTableCell align="right">
								<b>Hành động</b>
							</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{!loading &&
							devices
								?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								?.map((exportDevice: IDeviceDepartmentType, index: number) => (
									<RowDevice
										device={exportDevice}
										index={index}
										key={index}
										handleOpenDelete={handleOpenDelete}
										handleOpenEdit={handleOpenEdit}
										columns={columns.current}
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
						{!loading && devices.length === 0 && (
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
			{isOpenEditModal && (
				<DialogEdit
					isOpen={isOpenEditModal}
					onClose={() => setIsOpenEditModal(false)}
					dataUpdate={updatedRow}
					handleSubmitUpdate={handleSubmitUpdate}
				/>
			)}
		</>
	);
};

type RowDeviceProps = {
	handleOpenEdit: (exportDevice: any) => void;
	handleOpenDelete: (exportDevice: any) => void;
	device: IDeviceDepartmentType;
	index: number;
	columns: DeviceColumnType[];
	openIndex: number;
	handleOpen: (index: number) => void;
};

const RowDevice = ({
	device,
	handleOpenEdit,
	handleOpenDelete,
	columns,
	index,
	openIndex,
	handleOpen,
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

				{columns.map(col => {
					if (col.renderValue !== undefined) {
						if (col.id === 'QuantityExport' || col.id === 'QuantityOriginal' || col.id === 'QuantityRemain')
							return (
								<TableCell align="left" key={col.id}>
									{col.renderValue(device[col.id as keyof typeof device], device.Unit)}
								</TableCell>
							);
						if (col.id === 'HasTrain')
							return (
								<TableCell align="left" key={col.id}>
									{col.renderValue(device[col.id as keyof typeof device])}
								</TableCell>
							);
					}

					return (
						<TableCell key={col.id} align="left">{`${
							device[col.id as keyof typeof device] || ''
						}`}</TableCell>
					);
				})}

				<TableCell align="right" size="small">
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
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0, background: '#f3f3f3' }} colSpan={10}>
					<Collapse in={openIndex === index} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							{device?.listDeviceDetail?.length !== 0 ? (
								<>
									<Typography variant="h6" gutterBottom component="div">
										Nhập kho
									</Typography>
									<DeviceDetailTable data={device?.listDeviceDetail || []} unit={device.Unit} />
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
	data: IDeviceDetailType[];
	unit: String;
};

const DeviceDetailTable = ({ data, unit }: DeviceDetailTableProps) => {
	const [deviceDetails, setDeviceDetails] = useState<IDeviceDetailType[]>();
	const [open, setOpen] = useState<number>(-1);

	useEffect(() => {
		setDeviceDetails(() => {
			return data?.sort((a, b) => +b.OrderDate - +a.OrderDate);
		});
	});

	const columns = useRef<DeviceColumnType[]>([
		{ id: 'DeviceDetailId', header: 'Mã chi tiết TB' },
		{ id: 'Model', header: 'Model' },
		{ id: 'Price', header: 'Giá' },
		{ id: 'QuantityOriginal', header: 'SL ban đầu', renderValue: (qty: any, unit: any) => `${qty} (${unit})` },
		{ id: 'QuantityExport', header: 'SL xuất', renderValue: (qty: any, unit: any) => `${qty} (${unit})` },
		{ id: 'QuantityRemain', header: 'SL còn lại', renderValue: (qty: any, unit: any) => `${qty} (${unit})` },
		{ id: 'OrderId', header: 'Mã PN' },
		{ id: 'OrderDate', header: 'Ngày nhập', type: 'date' },
		{ id: 'ManufacturerName', header: 'Nhà sản xuất' },
		{ id: 'Origin', header: 'Origin' },
		{ id: 'DeviceId', header: 'Mã TB', hide: true },
	]);

	return (
		<>
			<TableContainer component={Paper} sx={{ marginBottom: '24px', overflow: 'overlay' }}>
				<Table size="small" aria-label="purchases" sx={{ padding: '8px' }}>
					<TableHead>
						<TableRow>
							<StyledTableCell></StyledTableCell>
							{columns.current.map(col => {
								if (col.hide === true) return null;
								return (
									<StyledTableCell key={col.id}>
										<b>{col.header}</b>
									</StyledTableCell>
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.map((deviceDetailType: IDeviceDetailType, index: number) => {
							return (
								<RowOfDeviceDetailTable
									deviceDetailType={deviceDetailType}
									key={index}
									unit={unit}
									columns={columns.current}
									index={index}
									handleOpen={(index: number) => setOpen(open === index ? -1 : index)}
									openIndex={open}
								/>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

type RowOfDeviceDetailTable = {
	deviceDetailType: IDeviceDetailType;
	unit: String;
	columns: DeviceColumnType[];
	index: number;
	openIndex: number;
	handleOpen: (index: number) => void;
};

const RowOfDeviceDetailTable = ({
	deviceDetailType,
	unit,
	columns,
	index,
	openIndex,
	handleOpen,
}: RowOfDeviceDetailTable) => {
	const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);

	const columnsExport = useRef<DeviceColumnType[]>([
		{
			id: 'ExpDeviceDeptId',
			header: 'Mã TB xuất',
		},
		{
			id: 'QuantityOriginal',
			header: 'Số lượng xuất',
			renderValue: (qty: any, unit: any) => `${qty} (${unit})`,
		},
		{
			id: 'DepartmentId',
			header: 'Khoa',
			renderValue: value => `${value}`,
		},
	]);

	return (
		<>
			<TableRow>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => handleOpen(index)}>
						{openIndex === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				{columns.map(col => {
					if (col.hide === true) return null;

					if (col.renderValue !== undefined) {
						if (col.id === 'QuantityExport' || col.id === 'QuantityOriginal' || col.id === 'QuantityRemain')
							return (
								<TableCell align="left" key={col.id}>
									{col.renderValue(deviceDetailType[col.id as keyof typeof deviceDetailType], unit)}
								</TableCell>
							);
						if (col.id === 'HasTrain')
							return (
								<TableCell align="left" key={col.id}>
									{col.renderValue(deviceDetailType[col.id as keyof typeof deviceDetailType])}
								</TableCell>
							);
					}

					if (col.type === 'date')
						return (
							<TableCell align="left" key={col.id}>
								{moment
									.unix(Number(deviceDetailType[col.id as keyof typeof deviceDetailType]))
									.format('DD/MM/YYYY')}
							</TableCell>
						);

					return (
						<TableCell align="left" key={col.id}>{`${
							deviceDetailType[col.id as keyof typeof deviceDetailType]
						}`}</TableCell>
					);
				})}
			</TableRow>

			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0, background: '#f3f3f3' }} colSpan={12}>
					<Collapse in={openIndex === index} timeout="auto" unmountOnExit>
						<Box sx={{ padding: 1 }}>
							{deviceDetailType?.listDeviceDept?.length !== 0 ? (
								<>
									<Typography variant="h6" gutterBottom component="div">
										Xuất kho
									</Typography>
									<TableContainer
										component={Paper}
										sx={{ maxHeight: '400px', marginBottom: '24px', overflow: 'overlay' }}
									>
										<Table size="small" aria-label="purchases" sx={{ padding: '8px' }}>
											<TableHead>
												<TableRow>
													{columnsExport.current.map(col => {
														return (
															<StyledTableCell key={col.id}>
																<b>{col.header}</b>
															</StyledTableCell>
														);
													})}
												</TableRow>
											</TableHead>
											<TableBody>
												{deviceDetailType?.listDeviceDept?.map(
													(deviceDept: IDeviceDeptType, index: number) => {
														let departmentName = departmentData.find(
															x => x.DepartmentId === deviceDept.DepartmentId,
														)?.DepartmentName;
														return (
															<TableRow key={index}>
																{columnsExport.current.map(col => {
																	if (col.renderValue !== undefined) {
																		if (col.id === 'DepartmentId')
																			return (
																				<TableCell align="left" key={col.id}>
																					{col.renderValue(departmentName)}
																				</TableCell>
																			);
																		if (col.id === 'QuantityOriginal')
																			return (
																				<TableCell align="left" key={col.id}>
																					{col.renderValue(
																						deviceDetailType[
																							col.id as keyof typeof deviceDetailType
																						],
																						unit,
																					)}
																				</TableCell>
																			);
																	}
																	return (
																		<TableCell align="left" key={col.id}>
																			{`${
																				deviceDept[
																					col.id as keyof typeof deviceDept
																				]
																			}`}
																		</TableCell>
																	);
																})}
															</TableRow>
														);
													},
												)}
											</TableBody>
										</Table>
									</TableContainer>
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

export default DeviceOfExperimentCenterTable;
