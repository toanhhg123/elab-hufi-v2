import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Autocomplete,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	IconButton,
	TextField,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Stack } from '@mui/system';
import axios from 'axios';
import { MRT_ColumnDef } from 'material-react-table';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks';
import { dummyExportDevice, IExportDeviceType } from '../../../types/exportDeviceType';

type CreateExportDeviceModalProps = {
	isOpen: boolean;
	initData: any;
	columns: MRT_ColumnDef<IExportDeviceType>[];
	onClose: () => void;
	handleSubmit: (list: any, row: any) => void;
	type: string;
};

const CreateExportDeviceModal = ({
	isOpen,
	initData,
	columns,
	onClose,
	handleSubmit,
	type,
}: CreateExportDeviceModalProps) => {
	const [createdRow, setCreatedRow] = useState<any>(dummyExportDevice);
	const [deviceData, setDeviceData] = useState([]);

	const [listDeviceAmount, setListDeviceAmount] = useState<any>([]);
	const [deviceAmount, setDeviceAmount] = useState<any>({ ExpDeviceDeptId: '', DeviceDetailId: '', Amount: 0 });
	const dispatch = useAppDispatch();
	const [exportDeviceIdText, setExportDeviceIdText] = useState('');
	const [loading, setLoading] = useState<boolean>(true);

	const handleChangeExportDeviceIdText = (e: ChangeEvent<HTMLInputElement>) => setExportDeviceIdText(e.target.value);

	useEffect(() => {
		let list = [];

		switch (type) {
			case 'DEP':
				list = initData?.listDeviceExport || [];
				break;
			case 'LAB':
				list = initData?.listDevice || [];
				break;
			default:
				break;
		}

		const listInitDevice = list?.map((device: any) => {
			switch (type) {
				case 'DEP':
					return {
						ExpDeviceDeptId: device?.ExpDeviceDeptId,
						DeviceDetailId: device?.DeviceDetailId,
						DeviceName: device?.DeviceName,
						Amount: device?.QuantityOriginal,
						Unit: device?.Unit,
					};
				case 'LAB':
					return {
						ExpDeviceDeptId: device?.ExpDeviceDeptId,
						DeviceDetailId: device?.DeviceDetailId,
						DeviceName: device?.DeviceName,
						Unit: device?.Unit,
					};
				default:
					break;
			}
		});

		setListDeviceAmount(listInitDevice || []);
	}, [initData]);

	useEffect(() => {
		const getDeviceData = async (DepartmentId: number = 1) => {
			const devicesDetail: any = [];
			Promise.all([
				axios.get(`https://aspsite.somee.com/api/devices/${DepartmentId}/Thiết bị`),
				axios.get(`https://aspsite.somee.com/api/devices/${DepartmentId}/Công cụ`),
				axios.get(`https://aspsite.somee.com/api/devices/${DepartmentId}/Dụng cụ`),
			])
				.then(resData => {
					resData.forEach(({ data }) => {
						data?.forEach((devices: any) => {
							for (let x of devices.listDeviceDetail) {
								devicesDetail.push({
									DeviceName: devices?.DeviceName,
									DeviceDetailId: x?.DeviceDetailId,
									Unit: devices.Unit,
								});
							}
						});
					});
				})
				.catch(() => {})
				.finally(() => {
					setDeviceData(devicesDetail);
					setLoading(false);
				});
		};

		getDeviceData();
	}, []);

	useEffect(() => {
		setCreatedRow((prev: any) => ({ ...prev, ...initData }));
	}, [initData]);

	return (
		<Dialog open={isOpen} PaperProps={{ style: { width: '850px', maxWidth: 'unset' } }}>
			<DialogTitle textAlign="center">
				<b>Tạo thông tin phiếu xuất thiết bị mới</b>
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
						{columns.map(column => {
							if (column.accessorKey === 'ExportId' || column.accessorKey === 'ExpRegGeneralId') {
								return (
									<TextField
										key={column.accessorKey}
										disabled
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.accessorKey && initData[column.accessorKey]}
									/>
								);
							}
							if (column.accessorKey === 'ExpDeviceDeptId') {
								const list = deviceData
									.map((x: any) => {
										const isExistInListAdded =
											listDeviceAmount?.findIndex(
												(y: any) => y.DeviceDetailId === x?.DeviceDetailId,
											) === -1;
										if (isExistInListAdded) {
											return {
												label: `${x?.DeviceDetailId} - ${x?.DeviceName}`,
												id: x?.DeviceDetailId,
												name: x?.DeviceDetailId,
												unit: x?.Unit,
											};
										}
									})
									.filter(x => x !== undefined);

								return (
									<Fragment key={column.accessorKey}>
										<TextField
											label={column.header}
											name={column.accessorKey}
											disabled={!deviceAmount.DeviceDetailId}
											value={exportDeviceIdText}
											onChange={handleChangeExportDeviceIdText}
										/>
										<FormControl>
											<Box>
												<Grid container spacing={1}>
													<Grid item xs={8}>
														<Autocomplete
															key={column.id}
															noOptionsText="Không có kết quả trùng khớp"
															options={list}
															defaultValue={
																list.find(
																	x => x?.id === deviceAmount['DeviceDetailId'],
																) || null
															}
															value={
																list.find(
																	x => x?.id === deviceAmount['DeviceDetailId'],
																) || null
															}
															loading={loading}
															getOptionLabel={option => option?.label || ''}
															renderInput={params => {
																return (
																	<TextField
																		{...params}
																		label="Thiết bị"
																		placeholder="Nhập để tìm kiếm"
																		InputProps={{
																			...params.InputProps,
																			endAdornment: (
																				<>
																					{loading ? (
																						<CircularProgress
																							color="inherit"
																							size={20}
																						/>
																					) : null}
																					{params.InputProps.endAdornment}
																				</>
																			),
																		}}
																	/>
																);
															}}
															onChange={(event, value) => {
																setExportDeviceIdText(value?.id || '');
																setDeviceAmount((prev: any) => ({
																	...prev,
																	DeviceDetailId: value?.id,
																	DeviceName: value?.name,
																	Unit: value?.unit,
																}));
															}}
														/>
													</Grid>
													<Grid item xs={3}>
														<TextField
															label={'Số lượng'}
															type="number"
															InputProps={{ inputProps: { min: 1 } }}
															value={deviceAmount.Amount}
															onChange={e =>
																setDeviceAmount({
																	...deviceAmount,
																	Amount: Number(e.target.value),
																})
															}
														/>
													</Grid>
													<Grid item xs={1}>
														<Box
															height="100%"
															display="flex"
															alignItems="center"
															justifyContent="center"
														>
															{deviceAmount.Unit && `(${deviceAmount.Unit})`}{' '}
														</Box>
													</Grid>
												</Grid>
												<Button
													aria-label="delete"
													color="primary"
													variant="contained"
													sx={{ float: 'right', marginTop: '8px' }}
													disabled={!deviceAmount.DeviceDetailId}
													onClick={() => {
														setListDeviceAmount((prev: any) => [
															...prev,
															{ ...deviceAmount, ExpDeviceDeptId: exportDeviceIdText },
														]);
														setDeviceAmount({ DeviceDetailId: '', Amount: 0 });
														setExportDeviceIdText('');
													}}
												>
													<AddIcon />
												</Button>
											</Box>
										</FormControl>
									</Fragment>
								);
							}
						})}
						<TableContainer component={Paper} sx={{ height: 440 }}>
							<Table size="small" aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>STT</TableCell>
										<TableCell>Mã thiết bị xuất</TableCell>
										<TableCell>Thiết bị</TableCell>
										<TableCell>SL</TableCell>
										<TableCell></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{listDeviceAmount.map((el: any, index: number) => (
										<TableRow
											key={index}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{index + 1}
											</TableCell>
											<TableCell>{el.ExpDeviceDeptId}</TableCell>
											<TableCell>
												{el.DeviceDetailId} - {el.DeviceName}
											</TableCell>
											<TableCell>
												{el.Amount} {el.Unit}
											</TableCell>
											<TableCell>
												<IconButton
													aria-label="delete"
													color="error"
													onClick={() => {
														let data = [...listDeviceAmount];
														data.splice(index, 1);
														setListDeviceAmount(data);
													}}
												>
													<DeleteIcon />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Stack>
				</form>
			</DialogContent>
			<DialogActions sx={{ p: '1.25rem' }}>
				<Button onClick={onClose}>Huỷ</Button>
				<Button
					color="primary"
					onClick={() => handleSubmit(listDeviceAmount, createdRow)}
					variant="contained"
					disabled={listDeviceAmount.length === 0}
				>
					Tạo
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateExportDeviceModal;
