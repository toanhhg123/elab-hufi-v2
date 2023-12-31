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
import { MRT_ColumnDef } from 'material-react-table';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks';
import { getDevices } from '../../../services/deviceDepartmentServices';
import { IDeviceDepartmentType } from '../../../types/deviceDepartmentType';
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
	const [deviceAmount, setDeviceAmount] = useState<any>({ DeviceDeptId: '', DeviceDetailId: '', Amount: 0 });
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
			case 'LAB_DEV':
				list = initData?.listDevice || [];
				break;
			case 'LAB_INS':
				list = initData?.listInstrument || [];
				break;
			case 'DEP_INS':
				list = initData?.listInstrumentExport || [];
				break;
			default:
				break;
		}

		const listInitDevice = list?.map((device: any) => {
			switch (type) {
				case 'DEP':
					return {
						...device,
						DeviceDeptId: device?.DeviceInfoId,
						DeviceDetailId: device?.DeviceInfoId,
						DeviceName: device?.DeviceName,
						SerialNumber: device?.SerialNumber,
						Unit: device?.Unit,
					};
				case 'LAB_DEV':
					return {
						...device,
						DeviceDeptId: device?.DeviceInfoId,
						DeviceDetailId: device?.DeviceDetailId,
						DeviceName: device?.DeviceName,
						Unit: device?.Unit,
						SerialNumber: device?.SerialNumber,
					};
				case 'LAB_INS':
					return {
						...device,
						DeviceDeptId: device?.InstrumentDeptId,
						DeviceDetailId: device?.DeviceDetailId,
						DeviceName: device?.DeviceName,
						Unit: device?.Unit,
						Quantity: device?.Quantity,
					};
				case 'DEP_INS':
					return {
						...device,
						DeviceDeptId: device?.InstrumentDeptId,
						DeviceDetailId: device?.DeviceDetailId,
						DeviceName: device?.DeviceName,
						Unit: device?.Unit,
						Amount: device?.QuantityOriginal,
					};
				default:
					break;
			}
		});
		console.log(initData);
		setListDeviceAmount(listInitDevice || []);
	}, [initData, type]);

	useEffect(() => {
		const getDeviceData = async (DepartmentId: number = 1) => {
			const devicesDetail: any = [];
			Promise.all([
				await getDevices(DepartmentId, 'Thiết bị'),
				await getDevices(DepartmentId, 'Công cụ'),
				await getDevices(DepartmentId, 'Dụng cụ'),
			])
				.then(resData => {
					resData.forEach((data: IDeviceDepartmentType[]) => {
						data?.forEach((devices: any) => {
							switch (type) {
								case 'DEP':
									for (let deviceDetail of devices.listDeviceDetail) {
										for (let x of deviceDetail.listDeviceDept) {
											if (x.DepartmentId === null)
												devicesDetail.push({
													DeviceDetailId: x?.DeviceInfoId,
													DeviceName: devices?.DeviceName,
													...x,
												});
										}
									}
									break;
								case 'LAB_DEV':
									if (devices.listDeviceInfo) {
										for (let x of devices.listDeviceInfo) {
											devicesDetail.push({
												DeviceName: devices?.DeviceName,
												DeviceDeptId: devices?.DeviceDetailId,
												DeviceInfoId: x?.DeviceInfoId,
												Unit: devices.Unit,
												SerialNumber: x?.SerialNumber,
												...x,
											});
										}
									}
									break;
								case 'LAB_INS':
									if (devices.DeviceType === 'Công cụ' || devices.DeviceType === 'Dụng cụ') {
										devicesDetail.push({
											DeviceName: devices?.DeviceName,
											DeviceDeptId: devices?.InstrumentDeptId,
											Unit: devices.Unit,
											Quantity: devices?.QuantityOriginal,
										});
									}
									break;
								case 'DEP_INS':
									if (devices.DeviceType === 'Công cụ' || devices.DeviceType === 'Dụng cụ') {
										for (let x of devices.listDeviceDetail) {
											devicesDetail.push({
												DeviceName: devices?.DeviceName,
												DeviceDeptId: x?.DeviceDetailId,
												Unit: devices.Unit,
												Quantity: x?.QuantityOriginal,
											});
										}
									}
									break;

								default:
									break;
							}
						});
					});
					setDeviceData(devicesDetail);
					setLoading(false);
				})
				.catch(err => {
					setLoading(false);
				})
				.finally(() => {
					setLoading(false);
				});
		};

		switch (type) {
			case 'DEP':
				getDeviceData();
				break;
			case 'LAB_DEV':
			case 'LAB_INS':
			case 'DEP_INS':
				getDeviceData(initData?.DepartmentId || -1);
				break;
			default:
				break;
		}
	}, [type]);

	useEffect(() => {
		setCreatedRow((prev: any) => ({ ...prev, ...initData }));
	}, [initData]);

	return (
		<Dialog open={isOpen} PaperProps={{ style: { width: '850px', maxWidth: 'unset' } }}>
			<DialogTitle textAlign="center">
				{type === 'DEP' || type === 'LAB_DEV' ? (
					<b>Tạo thông tin phiếu xuất thiết bị mới</b>
				) : (
					<b>Tạo thông tin phiếu xuất dụng cụ - công cụ mới</b>
				)}
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
							if (column.accessorKey === 'ExportId' || column.accessorKey === 'ExportLabId') {
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
							if (
								column.accessorKey === 'DeviceInfoId' ||
								(type === 'DEP_INS' && column.accessorKey === 'InstrumentDeptId') ||
								(type === 'LAB_INS' && column.accessorKey === 'InstrumentDeptId')
							) {
								const list = [...deviceData]
									.map((x: any) => {
										const isExistInListAdded =
											listDeviceAmount?.findIndex((y: any) => {
												switch (type) {
													case 'DEP':
														return y.DeviceDetailId === x?.DeviceDetailId;
													case 'LAB_DEV':
														return y.DeviceInfoId === x?.DeviceInfoId;
													case 'LAB_INS':
														return y.DeviceDeptId === x?.DeviceDeptId;

													default:
														break;
												}
											}) === -1;
										if (isExistInListAdded) {
											switch (type) {
												case 'DEP':
													return {
														label: `${x?.DeviceDetailId || ''} - ${x?.DeviceName || ''} - ${
															x?.SerialNumber || ''
														}`,
														id: x?.DeviceDetailId,
														name: x?.DeviceName,
														unit: x?.Unit,
														...x
													};
												case 'LAB_DEV':
													return {
														label: `${x?.DeviceInfoId || ''} - ${x?.DeviceName || ''} - ${
															x?.SerialNumber || ''
														} `,
														id: x?.DeviceInfoId,
														name: x?.DeviceName,
														SerialNumber: x?.SerialNumber,
														unit: x?.Unit,
														...x,
													};

												case 'LAB_INS':
													return {
														label: `${x?.DeviceDeptId || ''} - ${x?.DeviceName || ''}`,
														id: x?.DeviceDeptId,
														name: x?.DeviceName,
														unit: x?.Unit,
														...x,
													};
												case 'DEP_INS':
													return {
														label: `${x?.DeviceDeptId || ''} - ${x?.DeviceName || ''}`,
														id: x?.DeviceDeptId,
														name: x?.DeviceName,
														unit: x?.Unit,
														...x,
													};

												default:
													break;
											}
										}
									})
									.filter(x => x !== undefined);

								return (
									<Fragment key={column.accessorKey}>
										{(type === 'DEP_INS') && (
											<TextField
												label={column.header}
												name={column.accessorKey}
												disabled={!deviceAmount.DeviceDetailId}
												value={exportDeviceIdText}
												onChange={handleChangeExportDeviceIdText}
											/>
										)}
										<FormControl>
											<Box>
												<Grid container spacing={1}>
													<Grid
														item
														xs={
															type === 'LAB_INS' || type === 'DEP_INS'
																? 8
																: 12
														}
													>
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
																		label={`${
																			type === 'DEP' || type === 'LAB_DEV'
																				? 'Thiết bị'
																				: 'Dụng cụ - Công cụ'
																		}`}
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
																console.log(value);
																setExportDeviceIdText(value?.id || '');
																setDeviceAmount((prev: any) => ({
																	...prev,
																	...value,
																	DeviceDetailId: value?.id,
																	LabDevDeviceDeptId: value?.DeviceDeptId,
																	SerialNumber: value?.SerialNumber,
																	DeviceName: value?.name,
																	Unit: value?.unit,
																}));
															}}
														/>
													</Grid>
													{(type === 'LAB_INS' || type === 'DEP_INS') && (
														<>
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
														</>
													)}
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
															{ ...deviceAmount, DeviceDeptId: exportDeviceIdText },
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
										{(type === 'DEP' || type === 'LAB_INS' || type === 'DEP_INS') && (
											<TableCell>SL</TableCell>
										)}
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
											<TableCell>{el.DeviceDeptId}</TableCell>
											<TableCell>
												{
													{
														DEP: (
															<>
																{el?.SerialNumber || ''} - {el.DeviceName || ''}
															</>
														),
														LAB_DEV: (
															<>
																{el?.SerialNumber || ''} - {el.DeviceName || ''}
															</>
														),
														LAB_INS: <>{el.DeviceName || ''}</>,
														DEP_INS: <>{el.DeviceName || ''}</>,
													}[type]
												}
											</TableCell>
											{(type === 'DEP' || type === 'LAB_INS' || type === 'DEP_INS') && (
												<TableCell>
													{el.Amount || el.Quantity} {el.Unit}
												</TableCell>
											)}
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
				<Button onClick={onClose}>Hủy</Button>
				<Button color="primary" onClick={() => handleSubmit(listDeviceAmount, createdRow)} variant="contained">
					Tạo
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateExportDeviceModal;
