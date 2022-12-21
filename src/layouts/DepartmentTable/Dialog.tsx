import { Delete } from '@mui/icons-material';
import {
	AppBar,
	Autocomplete,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	debounce,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableHead,
	TableRow,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { DeviceType } from '../../configs/enums';
import { postDevice } from '../../services/deviceServices';
import { dummyDeviceDepartmentData, IDeviceDepartmentType } from '../../types/deviceDepartmentType';
import { useAppDispatch } from '../../hooks';
import { setSnackbarMessage } from '../../pages/appSlice';
import {
	dummyDeviceRecordUsageHours,
	IDeviceRecordUsageHours,
	IDeviceUsageHours,
} from '../../types/deviceUsageHoursType';
import {
	deleteRecordHours,
	getRecordHours,
	postRecordHours,
	putRecordHours,
} from '../../services/deviceUsageHoursServices';
import styled from '@emotion/styled';
import moment from 'moment';

const StyledTableCell = styled(TableCell)(theme => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: 'lightgray',
	},
}));

type DeviceColumnType = {
	id: string;
	header: String;
	type?: string;
	data?: any;
	size?: number;
	renderValue?: (...arg: any[]) => void;
	sx?: { [key: string]: string };
};

type DialogProps = {
	isOpen: boolean;
	onClose: () => void;
	handleSubmitDelete?: (DeviceId: String) => void;
	handleSubmitUpdate?: (updatedRow: any) => void;
	dataDelete?: IDeviceDepartmentType;
	dataUpdate?: IDeviceDepartmentType;
};

const columns: DeviceColumnType[] = [
	{
		id: 'DeviceId',
		header: 'Mã thiết bị',
		size: 120,
	},
	{
		id: 'DeviceName',
		header: 'Tên thiết bị',
		size: -1,
		sx: {
			minWidth: '200px',
		},
	},
	{
		id: 'DeviceType',
		header: 'Loại thiết bị',
		type: 'select',
		data: Object.keys(DeviceType).filter(v => isNaN(Number(v))),
		size: 180,
	},
	{
		id: 'Unit',
		header: 'Đơn vị',
		size: 120,
	},
	{
		id: 'HasTrain',
		header: 'Tập huấn',
		data: ['Có', 'Không'],
		renderValue: value => (value === 1 ? 'Có' : 'Không'),
		size: 180,
		type: 'select',
	},
	{
		id: 'Standard',
		header: 'Qui cách',
	},
];

const DialogCreate = ({ isOpen, onClose }: DialogProps) => {
	const [createdRow, setCreatedRow] = useState<any>([dummyDeviceDepartmentData]);
	const dispatch = useAppDispatch();

	const handleFormChange = useCallback(
		(event: any, value: any, index: number) => {
			const newArray = createdRow.map((item: any, i: number) => {
				if (index === i) {
					return { ...item, [event.target.name]: value };
				} else {
					return item;
				}
			});
			setCreatedRow(newArray);
		},
		[createdRow],
	);

	const addFields = useCallback(() => {
		setCreatedRow([...createdRow, dummyDeviceDepartmentData]);
	}, [createdRow]);

	const removeFields = (index: number) => {
		let data = createdRow.filter((x: any, i: number) => i !== index).map((item: any, i: number) => item);
		setCreatedRow(data);
	};

	const submit = async () => {
		const createData = createdRow
			.filter((x: any) => x.DeviceId !== '' && x.DeviceName !== '')
			.map((row: any) => {
				return {
					DeviceId: row.DeviceId,
					DeviceName: row.DeviceName,
					DeviceType: row.DeviceType,
					HasTrain: row.HasTrain === 'Có' ? 1 : 0,
					Standard: row.Standard,
					Unit: row.Unit,
				};
			});

		const res = await postDevice(createData);
		if (Object.keys(res).length !== 0) {
			dispatch(setSnackbarMessage('Tạo thông tin mới thành công'));
			onClose();
		} else {
			dispatch(setSnackbarMessage('Tạo thông tin mới không thành công'));
			onClose();
		}
	};

	const handleClose = () => {
		setCreatedRow([dummyDeviceDepartmentData]);
		onClose();
	};

	return (
		<Dialog fullScreen open={isOpen} onClose={handleClose}>
			<AppBar sx={{ position: 'relative', minWidth: '1200px', overflow: 'auto' }}>
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
						<CloseIcon />
					</IconButton>
					<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
						<b>Tạo thông tin thiết bị mới</b>
					</Typography>
					<Button autoFocus color="inherit" onClick={submit}>
						Lưu
					</Button>
				</Toolbar>
			</AppBar>
			<DialogContent sx={{ minWidth: '1200px', overflow: 'auto' }}>
				<form onSubmit={e => e.preventDefault()} style={{ marginTop: '10px' }}>
					{createdRow.map((field: any, indexField: number) => {
						return (
							<Stack
								sx={{
									width: '100%',
									gap: '1.5rem',
									display: 'flex',
									alignItems: 'center',
									flexDirection: 'row',
									marginBottom: '24px',
								}}
								key={indexField}
							>
								<RowCreateDevice
									field={field}
									handleFormChange={handleFormChange}
									indexField={indexField}
									removeFields={removeFields}
								/>
							</Stack>
						);
					})}
				</form>
				<Button variant="contained" onClick={() => addFields()}>
					Thêm hàng
				</Button>
			</DialogContent>
		</Dialog>
	);
};

const DialogDelete = ({ isOpen, onClose, dataDelete, handleSubmitDelete }: DialogProps) => {
	return (
		<>
			<Dialog open={isOpen} onClose={onClose}>
				<DialogTitle textAlign="center">
					<b>Xoá thông tin thiết bị</b>
				</DialogTitle>
				<DialogContent>
					<div>
						Bạn có chắc muốn xoá thông tin phiếu xuất thiết bị{' '}
						<Typography component="span" color="red">
							{dataDelete?.DeviceId} - {dataDelete?.DeviceName}
						</Typography>{' '}
						không?
					</div>
				</DialogContent>
				<DialogActions sx={{ p: '1.25rem' }}>
					<Button onClick={onClose}>Hủy</Button>
					<Button
						color="primary"
						onClick={() => handleSubmitDelete?.(dataDelete?.DeviceId || '')}
						variant="contained"
					>
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

const DialogEdit = ({ isOpen, onClose, dataUpdate, handleSubmitUpdate }: DialogProps) => {
	const [updatedRow, setUpdatedRow] = useState<any>(() => dataUpdate);

	return (
		<Dialog open={isOpen} onClose={onClose} PaperProps={{ style: { width: '800px', maxWidth: 'unset' } }}>
			<DialogTitle textAlign="center">
				<b>Sửa thông tin thiết bị</b>
			</DialogTitle>
			<DialogContent>
				<form onSubmit={e => e.preventDefault()} style={{ marginTop: '10px' }}>
					<Stack
						sx={{
							width: '100%',
							minWidth: { xs: '300px', sm: '360px', md: '400px' },
							gap: '1.5rem',
						}}
					>
						{updatedRow &&
							columns.map(column => {
								if (column.id === 'DeviceId') {
									return (
										<TextField
											disabled
											key={column.id}
											label={column.header}
											name={column.id}
											value={column.id && updatedRow[column.id]}
										/>
									);
								}
								if (column?.type === 'select' && column.id === 'HasTrain') {
									const list = column.data;

									return (
										<FormControl key={column.id}>
											<InputLabel>{column.header}</InputLabel>
											<Select
												value={
													list?.findIndex(
														(x: any) => x === column?.renderValue?.(updatedRow[column.id]),
													) > -1
														? list
																?.findIndex(
																	(x: any) =>
																		x ===
																		column?.renderValue?.(updatedRow[column.id]),
																)
																.toString()
														: ''
												}
												name={column.id}
												label={column.header}
												onChange={(e: SelectChangeEvent) =>
													setUpdatedRow({
														...updatedRow,
														[column.id]: list[Number(e.target.value)],
													})
												}
											>
												{list.map((x: any, idx: number) => (
													<MenuItem key={idx} value={idx}>
														{x}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									);
								}
								if (column?.type === 'select') {
									const list = column.data;

									return (
										<FormControl key={column.id}>
											<InputLabel>{column.header}</InputLabel>
											<Select
												value={
													list?.findIndex((x: any) => x === updatedRow[column.id]) > -1
														? list
																?.findIndex((x: any) => x === updatedRow[column.id])
																.toString()
														: ''
												}
												name={column.id}
												label={column.header}
												onChange={(e: SelectChangeEvent) =>
													setUpdatedRow({
														...updatedRow,
														[column.id]: list[Number(e.target.value)],
													})
												}
											>
												{list.map((x: any, idx: number) => (
													<MenuItem key={idx} value={idx}>
														{x}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									);
								} else {
									return (
										<TextField
											key={column.id}
											label={column.header}
											name={column.id}
											value={column.id && updatedRow[column.id]}
											onChange={e =>
												setUpdatedRow({ ...updatedRow, [column.id]: e.target.value })
											}
										/>
									);
								}
							})}
					</Stack>
				</form>
			</DialogContent>
			<DialogActions sx={{ p: '1.25rem' }}>
				<Button onClick={onClose}>Hủy</Button>
				<Button color="primary" onClick={() => handleSubmitUpdate?.(updatedRow)} variant="contained">
					Lưu thay đổi
				</Button>
			</DialogActions>
		</Dialog>
	);
};

type RowCreateDeviceProps = {
	field: any;
	indexField: number;
	handleFormChange: (e: any, value: any, index: number) => void;
	removeFields: (index: number) => void;
};

const RowCreateDevice = memo(({ field, indexField, handleFormChange, removeFields }: RowCreateDeviceProps) => {
	return (
		<>
			{columns?.map((column: DeviceColumnType, index: number) => {
				if (column?.type === 'select') {
					const list = column.data;

					return (
						<FormControl sx={{ m: 0, width: `${column.size}px` }} key={column.id}>
							<InputLabel>{column.header}</InputLabel>
							<Select
								value={
									list?.findIndex((x: any) => x === field[column.id]) > -1
										? list?.findIndex((x: any) => x === field[column.id]).toString()
										: ''
								}
								name={column.id}
								label={column.header}
								onChange={(e: SelectChangeEvent) =>
									handleFormChange(e, list[Number(e.target.value)], indexField)
								}
							>
								{list.map((x: any, idx: number) => (
									<MenuItem key={idx} value={idx}>
										{x}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					);
				} else {
					let style = {};
					if (column.sx) style = column.sx;

					return (
						<TextField
							key={index}
							label={column.header}
							name={column.id}
							sx={{
								maxWidth: column.size !== -1 ? `${column.size}px` : 'auto',
								flex: column.size === -1 ? 1 : '',
								...style,
							}}
							// defaultValue={column.id && field[column.id]}
							value={column.id && field[column.id]}
							onChange={e => handleFormChange(e, e.target.value, indexField)}
						/>
					);
				}
			})}
			<Tooltip arrow placement="right" title="Xoá hàng">
				<IconButton color="error" onClick={() => removeFields(indexField)}>
					<Delete />
				</IconButton>
			</Tooltip>
		</>
	);
});

type SelectRecordType = { month: Number; year: Number };

const DialogDeviceUsageHours = ({ isOpen, onClose }: DialogProps) => {
	const [openAutocomplete, setOpenAutocomplete] = useState<boolean>(false);
	const [listDevice, setListDevice] = useState<IDeviceUsageHours[]>([]);
	const loading = openAutocomplete && listDevice.length === 0;
	const [deviceSelected, setDeviceSelected] = useState<IDeviceUsageHours | null>(null);
	const [selected, setSelected] = useState<IDeviceRecordUsageHours[]>([]);
	const [recordInputValue, setRecordInputValue] = useState<IDeviceRecordUsageHours>(dummyDeviceRecordUsageHours);
	const [typeButton, setTypeButton] = useState<String>('POST');
	const [loadingSendRequest, setLoadingSendRequest] = useState<boolean>(false);
	const dispatch = useAppDispatch();

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
	]);

	const getListDevice = async () => {
		try {
			const list: IDeviceUsageHours[] = await getRecordHours();

			if (Array.isArray(list)) {
				setListDevice(list);
			}
		} catch (error) {
			setListDevice([]);
		}
	};

	useEffect(() => {
		setDeviceSelected(null);
		setSelected([]);
		setRecordInputValue(dummyDeviceRecordUsageHours);
		getListDevice();
	}, [isOpen]);

	useEffect(() => {
		if (deviceSelected)
			setDeviceSelected(listDevice.find(x => x.SerialNumber === deviceSelected.SerialNumber) || null);
	}, [listDevice]);

	useEffect(() => {
		let isExist: Boolean =
			deviceSelected?.listRecordHours.findIndex(
				x => x.Month === recordInputValue.Month && x.Year === recordInputValue.Year,
			) !== -1;
		isExist ? setTypeButton('PUT') : setTypeButton('POST');
	}, [recordInputValue, deviceSelected]);

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelected: IDeviceRecordUsageHours[] = deviceSelected?.listRecordHours?.map(n => n) || [];
			if (newSelected) handleSelect(newSelected);
			return;
		}
		handleSelect([]);
	};

	const handleSelect = (value: IDeviceRecordUsageHours[]) => {
		setSelected(value);
	};

	const handleClick = (event: React.MouseEvent<unknown>, record: IDeviceRecordUsageHours) => {
		const selectedIndex = selected.findIndex(x => x.Month === record.Month && x.Year === record.Year);
		let newSelected: IDeviceRecordUsageHours[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, record);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}
		setRecordInputValue(record);
		handleSelect(newSelected);
	};

	const handleAddRecord = async () => {
		setLoadingSendRequest(true);
		if (deviceSelected !== null) {
			let newData: IDeviceUsageHours = {
				...deviceSelected,
				listRecordHours: [
					{
						...recordInputValue,
						DateInput: `${Math.floor(Date.now() / 1000)}`,
					},
				],
			};

			try {
				if (typeButton === 'POST') {
					await postRecordHours(newData);
					dispatch(setSnackbarMessage('Thêm thành công!!!'));
				}
				if (typeButton === 'PUT') {
					await putRecordHours(newData);
					dispatch(setSnackbarMessage('Sửa thành công!!!'));
				}
				getListDevice();
			} catch (error) {
				dispatch(setSnackbarMessage('Đã xảy ra lỗi!!!'));
			} finally {
				setLoadingSendRequest(false);
			}
		}
	};

	const handleDeleteRecord = async () => {
		if (deviceSelected !== null && selected.length !== 0) {
			setLoadingSendRequest(true);
			let deleteData: IDeviceUsageHours = {
				...deviceSelected,
				listRecordHours: selected,
			};
			try {
				await deleteRecordHours(deleteData);
				dispatch(setSnackbarMessage('Xóa thành công!!!'));
				setSelected([]);
				getListDevice();
			} catch (error) {
				dispatch(setSnackbarMessage('Đã xảy ra lỗi!!!'));
			} finally {
				setLoadingSendRequest(false);
			}
		}
	};

	return (
		<Dialog open={isOpen} onClose={onClose} PaperProps={{ style: { width: '800px', maxWidth: 'unset' } }}>
			<DialogTitle textAlign="left">
				<b>Nhập giờ sử dụng thiết bị</b>

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
				<Autocomplete
					id="device-usage"
					open={openAutocomplete}
					onOpen={() => {
						setOpenAutocomplete(true);
					}}
					onClose={() => {
						setOpenAutocomplete(false);
					}}
					isOptionEqualToValue={(option, value) => option.SerialNumber === value.SerialNumber}
					getOptionLabel={option => `${option.SerialNumber} - ${option.DeviceName}`}
					options={listDevice}
					loading={loading}
					onChange={(e, value) => {
						setDeviceSelected(value);
						setRecordInputValue(dummyDeviceRecordUsageHours);
					}}
					renderInput={params => (
						<TextField
							{...params}
							label="Thiết bị..."
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<Fragment>
										{loading ? <CircularProgress color="inherit" size={20} /> : null}
										{params.InputProps.endAdornment}
									</Fragment>
								),
							}}
						/>
					)}
				/>

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
									}));
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
									}));
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
									}));
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
								);
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{deviceSelected &&
							deviceSelected?.listRecordHours?.map((device, index) => {
								let isSelect: boolean | undefined =
									selected.find(x => x.Month === device.Month && x.Year === device.Year) !==
									undefined;
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
												);

											return (
												<TableCell align="left" key={col.id}>
													{`${device[col.id as keyof typeof device] || ''}`}
												</TableCell>
											);
										})}
									</TableRow>
								);
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
	);
};

export { DialogCreate, DialogDelete, DialogEdit, DialogDeviceUsageHours };
