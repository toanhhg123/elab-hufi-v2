import { MRT_ColumnDef } from 'material-react-table';
import { dummyExportChemicalData, IExportChemicalType } from '../../types/exportChemicalType';
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
import { Stack } from '@mui/system';
import { ClockNumberProps, DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { RootState } from '../../store';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import { getExportChemical, postExportChemicals } from '../../services/exportChemicalServices';
import { setSnackbarMessage } from '../../pages/appSlice';
import { setListOfExportChemical } from './exportChemicalSlice';

type CreateModalProps = {
	isCreateModal: boolean;
	columns: MRT_ColumnDef<IExportChemicalType>[];
	onCloseCreateModal: React.MouseEventHandler;
	handleSubmitCreateModal: Function;
};

const CreateModal = ({ isCreateModal, columns, onCloseCreateModal, handleSubmitCreateModal }: CreateModalProps) => {
	const [createdRow, setCreatedRow] = useState<any>(dummyExportChemicalData);
	const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const chemicalData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);

	const [listChemicalAmount, setListChemicalAmount] = useState<any>([]);
	const [chemicalAmount, setChemicalAmount] = useState<any>({ ChemicalId: '', Amount: 1 });
	const dispatch = useAppDispatch();

	const handleSubmit = async () => {
		handleSubmitCreateModal(createdRow, listChemicalAmount);
	};

	return (
		<Dialog open={isCreateModal}>
			<DialogTitle textAlign="center">
				<b>Tạo thông tin phiếu xuất hóa chất mới</b>
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
							} else if (column.id === 'ChemicalId') {
								return (
									<FormControl key={column.accessorKey}>
										<Box>
											<Grid container spacing={1}>
												<Grid item xs={9}>
													<FormControl sx={{ m: 0, width: '100%' }}>
														<InputLabel id="laboratories-select-required-label">
															Hóa chất
														</InputLabel>
														<Select
															labelId="laboratories-select-required-label"
															id="laboratories-select-required"
															value={
																chemicalData.findIndex(
																	x => x.ChemicalId === chemicalAmount.ChemicalId,
																) > -1
																	? chemicalData
																			.findIndex(
																				x =>
																					x.ChemicalId ===
																					chemicalAmount.ChemicalId,
																			)
																			.toString()
																	: ''
															}
															label="Hóa chất"
															onChange={(e: SelectChangeEvent) =>
																setChemicalAmount((prev: any) => ({
																	...prev,
																	ChemicalId:
																	chemicalData[Number(e.target.value)].ChemicalId,
																ChemicalName:
																	chemicalData[Number(e.target.value)]
																		.ChemicalName,	
																}))
															}
														>
															{chemicalData.map((x, idx) => (
																<MenuItem key={idx} value={idx}>
																	{x.ChemicalId} - {x.ChemicalName}
																</MenuItem>
															))}
														</Select>
													</FormControl>
												</Grid>
												<Grid item xs={3}>
													<TextField
														label={'Số lượng'}
														type="number"
														InputProps={{ inputProps: { min: 1 } }}
														value={chemicalAmount.Amount}
														onChange={e =>
															setChemicalAmount({
																...chemicalAmount,
																Amount: Number(e.target.value),
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
												onClick={() =>
													{
														setListChemicalAmount((prev: any) => [...prev, chemicalAmount])
														setChemicalAmount({ ChemicalId: '', Amount: 1 })
													}
												}
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
									{listChemicalAmount.map((el: any, index: number) => (
										<TableRow
											key={index}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{index + 1}
											</TableCell>
											<TableCell>
												{el.ChemicalId} - {el.ChemicalName}
											</TableCell>
											<TableCell>{el.Amount}</TableCell>
											<TableCell>
												<IconButton
													aria-label="delete"
													color="error"
													onClick={() => {
														let data = [...listChemicalAmount];
														data.splice(index, 1);
														setListChemicalAmount(data);
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
