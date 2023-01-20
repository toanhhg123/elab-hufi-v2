import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
	Box,
	Button,
	ButtonGroup,
	Checkbox,
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
	TextField
} from '@mui/material';

import _ from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { colorsNotifi } from '../../../configs/color';
import { useAppDispatch } from '../../../hooks';
import { setSnackbar } from '../../../pages/appSlice';
import {
	deleteMaintenanceDevice,
	getMaintenanceDeviceById,
	postMaintenanceDevice,
	updateMaintenanceDevice
} from '../../../services/maintenanceDevicesServices';
import { dummyRepairDeviceItem, IRepairDevice, IRepairDeviceItem } from '../../../types/maintenanceDevicesType';
import { descendingComparator, renderArrowSort } from '../../ChemicalWarehouseTable/Utils';
import { ProviderValueType, useDeviceOfDepartmentTableStore } from '../context/DeviceOfDepartmentTableContext';
import { removeAccents } from '../DeviceOfDepartmentTable';
import { ColumnsType, DialogProps } from './DialogType';
import { nestedObject } from './ultis';

const DialogMaintenanceDevice = ({
	isOpen,
	onClose,
	data,
	loading,
}: DialogProps & {
	data: IRepairDevice | null;
	loading: boolean;
}) => {
	const columns = useRef<ColumnsType[]>([
		{ id: 'RepairId', header: 'ID' },
		{ id: 'Content', header: 'Nội dụng' },
		{ id: 'Cost', header: 'Giá' },
		{ id: 'DateCreate', header: 'Ngày tạo' },
		{ id: 'EmployeeName', header: 'Người yêu cầu bảo trì' },
		{ id: 'Status', header: 'Trạng thái' },
	]);
	const dispatch = useAppDispatch();
	const [maintenanceDevice, setMaintenanceDevice] = useState<IRepairDevice | null>(null);
	const [loadingSendRequest, setLoadingSendRequest] = useState<boolean>(false);
	const statusList = useRef<string[]>(['Đang bảo trì', 'Đã bảo trì']);
	const [newMaintenance, setNewMaintenance] = useState<IRepairDeviceItem>(dummyRepairDeviceItem);
	const [selected, setSelected] = useState<IRepairDeviceItem[]>([]);
	const [typeRequest, setTypeRequest] = useState<'PUT' | 'POST'>('POST');
	const { getDeviceData }: ProviderValueType = useDeviceOfDepartmentTableStore();
	const [order, setOrder] = useState<string>('asc');
	const [orderBy, setOrderBy] = useState<string>('DeviceId');
	const [keyword, setKeyword] = useState<String | null>(null);

	const getMaintenance = async () => {
		try {
			let newMaintenanceDevice: IRepairDevice = await getMaintenanceDeviceById(
				maintenanceDevice?.SerialNumber || '',
			);
			if (newMaintenanceDevice) {
				setMaintenanceDevice(newMaintenanceDevice);
			}
		} catch (error) {
			dispatch(
				setSnackbar({
					message: 'Đã xảy ra lỗi!!!',
					color: colorsNotifi['error'].color,
					backgroundColor: colorsNotifi['error'].background,
				}),
			);
		}
	};

	useEffect(() => {
		setMaintenanceDevice(data);
		setKeyword('');
	}, [data]);

	useEffect(() => {
		if (!isOpen) {
			setTypeRequest('POST');
			setKeyword(null);
			setSelected([]);
			setNewMaintenance(dummyRepairDeviceItem);
			setLoadingSendRequest(false);
			setMaintenanceDevice(null)
		}
	}, [isOpen]);

	useEffect(() => {
		if (
			maintenanceDevice?.listRepair?.findIndex(x => x.RepairId === newMaintenance.RepairId) === -1 ||
			newMaintenance.RepairId === -1
		) {
			setTypeRequest('POST');
		} else {
			setTypeRequest('PUT');
		}
	}, [newMaintenance]);

	useEffect(() => {
		if (!selected.length) {
			setNewMaintenance(dummyRepairDeviceItem);
		}
	}, [selected]);

	useEffect(() => {
		const sortDevices = (prev: IRepairDevice | null) => {
			if (prev !== null && data !== null) {
				let cloneData: IRepairDevice = { ...prev };
				let listMaintenance: IRepairDeviceItem[];

				if (keyword?.trim() === '' || keyword === null) {
					cloneData = data;
				} else {
					listMaintenance = cloneData.listRepair.filter(item => {
						if (keyword?.trim() === '' || keyword === null) return true;

						let searchString: String = '';

						searchString = nestedObject(item, searchString);
						searchString = removeAccents(searchString.toUpperCase());

						return searchString.includes(`${keyword}`);
					});

					cloneData = { ...cloneData, listRepair: listMaintenance };
				}

				listMaintenance =
					cloneData?.listRepair?.sort((a: IRepairDeviceItem, b: IRepairDeviceItem) => {
						let i =
							order === 'desc'
								? descendingComparator<any>(a, b, orderBy)
								: -descendingComparator<any>(a, b, orderBy);
						return i;
					}) || [];

				return (
					{
						...cloneData,
						listMaintenance,
					} || []
				);
			}
			return null;
		};
		setMaintenanceDevice(sortDevices(maintenanceDevice));
	}, [order, orderBy, keyword]);

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelected: IRepairDeviceItem[] = maintenanceDevice?.listRepair?.map(n => n) || [];
			if (newSelected) handleSelect(newSelected);
			return;
		}
		handleSelect([]);
	};

	const handleSelect = (value: IRepairDeviceItem[]) => {
		setSelected(value);
	};

	const handleClick = (maintenance: IRepairDeviceItem) => {
		const selectedIndex = selected.findIndex(x => x.RepairId === maintenance.RepairId);
		let newSelected: IRepairDeviceItem[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, maintenance);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		handleSelect(newSelected);
		setNewMaintenance(maintenance);
	};

	const handleAddMaintenance = async () => {
		setLoadingSendRequest(true);

		try {
			if (typeRequest === 'POST') {
				await addMaintenance();
			}

			if (typeRequest === 'PUT') {
				await editMaintenance();
			}
		} catch (error) {
		} finally {
			handleSelect([]);
			setNewMaintenance(dummyRepairDeviceItem);
			setLoadingSendRequest(false);
			getMaintenance();
			getDeviceData(true);
		}
	};

	const addMaintenance = async () => {
		try {
			if (maintenanceDevice !== null && _.isEqual(newMaintenance, dummyRepairDeviceItem) === false) {
				await postMaintenanceDevice({
					...maintenanceDevice,
					listRepair: [
						{
							...newMaintenance,
							DateCreate: `${Math.floor(Date.now() / 1000)}`,
						},
					],
				});

				dispatch(
					setSnackbar({
						message: 'Thêm thành công!!!',
						color: colorsNotifi['success'].color,
						backgroundColor: colorsNotifi['success'].background,
					}),
				);
				return;
			}

			throw new Error('Đã xảy ra lỗi!!!');
		} catch (error) {
			dispatch(
				setSnackbar({
					message: 'Đã xảy ra lỗi!!!',
					color: colorsNotifi['error'].color,
					backgroundColor: colorsNotifi['error'].background,
				}),
			);
		} finally {
			setLoadingSendRequest(false);
		}
	};

	const editMaintenance = async () => {
		try {
			if (
				maintenanceDevice !== null &&
				_.isEqual(newMaintenance, dummyRepairDeviceItem) === false &&
				_.isEqual(selected, newMaintenance) === false &&
				newMaintenance.RepairId !== -1
			) {
				await updateMaintenanceDevice({
					...maintenanceDevice,
					listRepair: [
						{
							...newMaintenance,
							DateCreate: `${Math.floor(Date.now() / 1000)}`,
						},
					],
				});

				dispatch(
					setSnackbar({
						message: 'Cập nhật thành công!!!',
						color: colorsNotifi['success'].color,
						backgroundColor: colorsNotifi['success'].background,
					}),
				);
				return;
			}

			throw new Error('Đã xảy ra lỗi!!!');
		} catch (error) {
			dispatch(
				setSnackbar({
					message: 'Đã xảy ra lỗi!!!',
					color: colorsNotifi['error'].color,
					backgroundColor: colorsNotifi['error'].background,
				}),
			);
		} finally {
			setLoadingSendRequest(false);
		}
	};

	const handleDeleteMaintenance = () => {
		setLoadingSendRequest(true);
		let requests: Promise<void>[] = selected.map(s => deleteMaintenanceDevice(`${s.RepairId}`));

		Promise.all(requests)
			.then(() => {
				dispatch(
					setSnackbar({
						message: 'Xóa thành công!!!',
						color: colorsNotifi['success'].color,
						backgroundColor: colorsNotifi['success'].background,
					}),
				);
			})
			.catch(() => {
				dispatch(
					setSnackbar({
						message: 'Đã xảy ra lỗi!!!',
						color: colorsNotifi['error'].color,
						backgroundColor: colorsNotifi['error'].background,
					}),
				);
			})
			.finally(() => {
				handleSelect([]);
				setNewMaintenance(dummyRepairDeviceItem);
				setLoadingSendRequest(false);
				getMaintenance();
			});
	};

	const handleRequestSort = (property: string) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	return (
		<Dialog open={isOpen} onClose={onClose} PaperProps={{ style: { width: '800px', maxWidth: 'unset' } }}>
			<DialogTitle textAlign="left">
				<b>Bảo trì thiết bị</b>

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
							<Grid item sm={6} xs={12}>
								<TextField
									fullWidth
									InputProps={{
										readOnly: true,
									}}
									variant="standard"
									value={maintenanceDevice?.SerialNumber}
									label="Số Serial"
								/>
							</Grid>
							<Grid item sm={6} xs={12}>
								<TextField
									fullWidth
									InputProps={{
										readOnly: true,
									}}
									variant="standard"
									value={maintenanceDevice?.DeviceName}
									label="Tên thiết bị"
								/>
							</Grid>
							<Grid item sm={6} xs={12}>
								<TextField
									fullWidth
									InputProps={{
										readOnly: true,
									}}
									variant="standard"
									value={maintenanceDevice?.Unit}
									label="Đơn vị tính"
								/>
							</Grid>
							<Grid item sm={6} xs={12}>
								<TextField
									fullWidth
									InputProps={{
										readOnly: true,
									}}
									variant="standard"
									value={moment.unix(Number(maintenanceDevice?.DateStartUsage)).format('DD/MM/YYYY')}
									label="Giờ bắt đầu sử dụng"
								/>
							</Grid>
							<Grid item xs={12}>
								<Divider />
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									InputProps={{}}
									variant="standard"
									label="Mã bảo trì"
									inputProps={{
										value: `${newMaintenance.RepairId !== -1 ? newMaintenance.RepairId : ''}`,
									}}
									disabled
								/>
							</Grid>

							<Grid item sm={6} xs={12}>
								<TextField
									fullWidth
									InputProps={{}}
									variant="standard"
									label="Nội dung bảo trì"
									inputProps={{
										value: `${newMaintenance.Content}`,
									}}
									onChange={e =>
										setNewMaintenance(prev => ({
											...prev,
											Content: e.target.value,
										}))
									}
								/>
							</Grid>

							<Grid item sm={6} xs={12}>
								<TextField
									fullWidth
									type="number"
									inputProps={{
										min: 0,
										step: 10000,
										value: `${newMaintenance.Cost}`,
									}}
									variant="standard"
									label="Giá"
									onChange={e =>
										setNewMaintenance(prev => ({
											...prev,
											Cost: Number(e.target.value),
										}))
									}
								/>
							</Grid>
							<Grid item sm={6} xs={12}>
								<TextField
									fullWidth
									InputProps={{
										readOnly: true,
									}}
									variant="standard"
									value={newMaintenance.EmployeeName}
									disabled
									label="Người yêu cầu bảo trì"
									onChange={e =>
										setNewMaintenance(prev => ({
											...prev,
											EmployeeName: e.target.value,
										}))
									}
								/>
							</Grid>
							<Grid item sm={6} xs={12}>
								<TextField
									select
									label="Trạng thái"
									fullWidth
									variant="standard"
									value={newMaintenance.Status}
									onChange={e =>
										setNewMaintenance(prev => ({
											...prev,
											Status: e.target.value,
										}))
									}
								>
									{statusList.current.map(option => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
									))}
								</TextField>
							</Grid>

							<Grid item xs={12}>
								<ButtonGroup variant="contained">
									<Button
										onClick={handleAddMaintenance}
										disabled={
											newMaintenance.Content.trim() === '' ||
											newMaintenance.Status.trim() === '' ||
											loadingSendRequest
										}
									>
										{loadingSendRequest && <CircularProgress color="inherit" size={24} />}
										{!loadingSendRequest && typeRequest === 'POST' && 'Thêm'}
										{!loadingSendRequest && typeRequest === 'PUT' && 'Sửa'}
									</Button>
									<Button
										color="error"
										disabled={!selected.length || loadingSendRequest}
										onClick={handleDeleteMaintenance}
									>
										{loadingSendRequest ? <CircularProgress color="inherit" size={24} /> : 'Xóa'}
									</Button>
								</ButtonGroup>
							</Grid>
						</Grid>

						<TextField
							sx={{
								marginTop: '24px',
								marginBottom: '4px',
							}}
							fullWidth
							size="small"
							type="search"
							placeholder="Tìm kiếm..."
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
						<TableContainer
							component={Paper}
							sx={{
								minHeight: {
									xs: '280px',
								},
							}}
						>
							<Table stickyHeader size="small" sx={{ minWidth: '600px' }}>
								<TableHead>
									<TableRow>
										<TableCell padding="checkbox" sx={{ background: '#d3d3d3' }}>
											<Checkbox
												color="primary"
												indeterminate={
													selected.length > 0 &&
													selected.length < (maintenanceDevice?.listRepair.length || 0)
												}
												checked={
													(maintenanceDevice?.listRepair?.length || 0) > 0 &&
													selected.length === maintenanceDevice?.listRepair?.length
												}
												onChange={handleSelectAllClick}
												inputProps={{
													'aria-label': 'select all desserts',
												}}
											/>
										</TableCell>
										{columns.current?.map(col => (
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
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{maintenanceDevice?.listRepair?.length === 0 && (
										<TableRow>
											<TableCell colSpan={7} sx={{ borderBottom: '0', textAlign: 'center' }}>
												<h3 style={{ width: '100%', padding: '16px 0px' }}>Trống</h3>
											</TableCell>
										</TableRow>
									)}
									{maintenanceDevice?.listRepair?.map((device, index) => {
										let isSelect: boolean | undefined =
											selected.find(x => x.RepairId === device.RepairId) !== undefined;

										return (
											<TableRow
												selected={isSelect}
												key={`${device.RepairId}`}
												role="checkbox"
												sx={{ position: 'relative' }}
												onClick={event => handleClick(device)}
											>
												<TableCell padding="checkbox">
													<Checkbox color="primary" checked={isSelect} />
												</TableCell>
												{columns.current.map(col => {
													if (col.id === 'DateCreate')
														return (
															<TableCell key={col.id}>
																{moment
																	.unix(Number(device?.DateCreate))
																	.format('DD/MM/YYYY')}
															</TableCell>
														);
													if (col.id === 'Cost')
														return (
															<TableCell key={col.id}>
																{device.Cost.toLocaleString('vi-VN')}
															</TableCell>
														);
													return (
														<TableCell key={col.id}>{`${
															device[col.id as keyof typeof device]
														}`}</TableCell>
													);
												})}
											</TableRow>
										);
									})}
								</TableBody>
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

export default DialogMaintenanceDevice;
