import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Autocomplete,
	Box,
	Button,
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
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setSnackbarMessage } from '../../../pages/appSlice';
import { getExportDevice, postExportDevices } from '../../../services/exportDeviceServices';
import { RootState } from '../../../store';
import { dummyExportDevice, IExportDeviceType } from '../../../types/exportDeviceType';
import { setListOfExportDevice } from '../../ExportDeviceTable/exportDeviceSlice';

type CreateExportDeviceModalProps = {
	initData: any;
	isOpen: boolean;
	columns: MRT_ColumnDef<IExportDeviceType>[];
	onClose: () => void;
};

const CreateExportDeviceModal = ({ isOpen, initData, columns, onClose }: CreateExportDeviceModalProps) => {
	const [createdRow, setCreatedRow] = useState<any>(dummyExportDevice);
	const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
	const exportDeviceData = useAppSelector((state: RootState) => state.exportDevice.listOfExportDevice);

	const [listDeviceAmount, setListDeviceAmount] = useState<any>([]);
	const [deviceAmount, setDeviceAmount] = useState<any>({ DeviceId: '', Quantity: 1 });
	const dispatch = useAppDispatch();

	const handleSubmit = async () => {
		const newExportDevices = listDeviceAmount.map((el: any) => {
			const data: IExportDeviceType = {
				ExportId: createdRow.ExportId,
				DeviceId: el.DeviceId,
				Quantity: el.Quantity,
			};
			return data;
		});
		const resData = await postExportDevices(newExportDevices);
		if (Object.keys(resData).length !== 0) {
			const newListOfExportDevice: IExportDeviceType[] = await getExportDevice();
			if (newListOfExportDevice) {
				dispatch(setSnackbarMessage('Tạo thông tin thành công'));
				dispatch(setListOfExportDevice(newListOfExportDevice));
			}
		} else {
			dispatch(setSnackbarMessage('Tạo thông tin không thành công'));
		}
		onClose();
	};

	useEffect(() => {
		setCreatedRow((prev: any) => ({ ...prev, ExportId: initData.ExportId }));
	}, [initData]);

	return (
		<Dialog open={isOpen}>
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
							if (column.accessorKey === 'ExportId') {
								return (
									<TextField
										disabled
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.accessorKey && initData['ExportId']}
									/>
								);
							} else if (column.accessorKey === 'DeviceId') {
								const list = deviceData.map((x) => {
									const isExistInListAdded =
										listDeviceAmount.findIndex((y: any) => y.DeviceId === x.DeviceId) === -1;
									const isExistInListData =
										exportDeviceData.findIndex(
											y => y.DeviceId === x.DeviceId && y.ExportId === initData['ExportId'],
										) === -1;
									if (isExistInListAdded && isExistInListData) {
										return {
											label: `${x.DeviceId} - ${x.DeviceName}`,
											id: x.DeviceId,
											name: x.DeviceName,
										};
									}
								}).filter(x => x !== undefined)
								
								return (
									<FormControl key={column.accessorKey}>
										<Box>
											<Grid container spacing={1}>
												<Grid item xs={9}>
													<Autocomplete
														key={column.id}
														noOptionsText="Không có kết quả trùng khớp"
														options={list}
														defaultValue={
															list.find(x => x?.id === deviceAmount['DeviceId']) || null
														}
														value={list.find(x => x?.id === deviceAmount['DeviceId']) || null}
														getOptionLabel={option => option?.label || ""}
														renderInput={params => {
															return (
																<TextField
																	{...params}
																	label="Thiết bị"
																	placeholder="Nhập để tìm kiếm"
																/>
															);
														}}
														onChange={(event, value) => {
															setDeviceAmount((prev: any) => ({
																...prev,
																DeviceId: value?.id,
																DeviceName: value?.name,
															}));
														}}
													/>
												</Grid>
												<Grid item xs={3}>
													<TextField
														label={'Số lượng'}
														type="number"
														InputProps={{ inputProps: { min: 1 } }}
														value={deviceAmount.Quantity}
														onChange={e =>
															setDeviceAmount({
																...deviceAmount,
																Quantity: Number(e.target.value),
															})
														}
													/>
												</Grid>
											</Grid>
											<Button
												aria-label="delete"
												color="primary"
												variant="contained"
												disabled={deviceAmount.DeviceId === ""}
												sx={{ float: 'right', marginTop: '8px' }}
												onClick={() => {
													setListDeviceAmount((prev: any) => [...prev, deviceAmount]);
													setDeviceAmount({ DeviceId: '', Quantity: 1 });
												}}
											>
												<AddIcon />
											</Button>
										</Box>
									</FormControl>
								);
							}
						})}
						<TableContainer component={Paper} sx={{ height: 440 }}>
							<Table aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>STT</TableCell>
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
											<TableCell>
												{el.DeviceId} - {el.DeviceName}
											</TableCell>
											<TableCell>{el.Quantity}</TableCell>
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
					onClick={handleSubmit}
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
