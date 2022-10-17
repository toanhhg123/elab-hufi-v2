import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
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
import React, { useState } from 'react';
import { useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import { dummyExportDevice, IExportDeviceType } from '../../types/exportDeviceType';

type CreateModalProps = {
	isCreateModal: boolean;
	columns: MRT_ColumnDef<IExportDeviceType>[];
	onCloseCreateModal: React.MouseEventHandler;
	handleSubmitCreateModal: Function;
};

const CreateModal = ({ isCreateModal, columns, onCloseCreateModal, handleSubmitCreateModal }: CreateModalProps) => {
	const [createdRow, setCreatedRow] = useState<any>(dummyExportDevice);
	const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);

	const [listDeviceAmount, setListDeviceAmount] = useState<any>([]);
	const [deviceAmount, setDeviceAmount] = useState<any>({ DeviceId: '', Quantity: 1 });

	const handleSubmit = async () => {
		handleSubmitCreateModal(createdRow, listDeviceAmount);
	};

	return (
		<Dialog open={isCreateModal}>
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
							if (column.id === 'ExportId') {
								return (
									<TextField
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.id && createdRow[column.id]}
										onChange={debounce(
											e => setCreatedRow({ ...createdRow, [e.target.name]: e.target.value }),
											200,
										)}
									/>
								);
							} else if (column.id === 'DeviceId') {
								return (
									<FormControl key={column.accessorKey}>
										<Box>
											<Grid container spacing={1}>
												<Grid item xs={9}>
													<FormControl sx={{ m: 0, width: '100%' }}>
														<InputLabel id="laboratories-select-required-label">
															Thiết bị
														</InputLabel>
														<Select
															labelId="laboratories-select-required-label"
															id="laboratories-select-required"
															value={
																deviceData.findIndex(
																	x => x.DeviceId === deviceAmount.DeviceId,
																) > -1
																	? deviceData
																			.findIndex(
																				x =>
																					x.DeviceId ===
																					deviceAmount.DeviceId,
																			)
																			.toString()
																	: ''
															}
															label="Thiết bị"
															onChange={(e: SelectChangeEvent) =>
																setDeviceAmount((prev: any) => ({
																	...prev,
																	DeviceId:
																		deviceData[Number(e.target.value)].DeviceId,
																	DeviceName:
																		deviceData[Number(e.target.value)].DeviceName,
																}))
															}
														>
															{deviceData.map((x, idx) => {
																if (
																	listDeviceAmount.findIndex(
																		(y: any) => y.DeviceId === x.DeviceId,
																	) === -1
																) {
																	return (
																		<MenuItem key={idx} value={idx}>
																			{x.DeviceId} - {x.DeviceName}
																		</MenuItem>
																	);
																}
															})}
														</Select>
													</FormControl>
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
										<TableCell>Hóa chất</TableCell>
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
				<Button onClick={onCloseCreateModal}>Huỷ</Button>
				<Button color="primary" onClick={handleSubmit} variant="contained">
					Tạo
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateModal;
