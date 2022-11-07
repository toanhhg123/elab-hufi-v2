import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Autocomplete,
	Box,
	Button, Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	IconButton, TextField
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
import { getExportChemical, postExportChemicals } from '../../../services/exportChemicalServices';
import { RootState } from '../../../store';
import { dummyExportChemicalData, IExportChemicalType } from '../../../types/exportChemicalType';
import { setListOfExportChemical } from '../../ExportChemicalTable/exportChemicalSlice';

type CreateExportChemicalModalProps = {
	isOpen: boolean;
	initData: any;
	columns: MRT_ColumnDef<IExportChemicalType>[];
	onClose: () => void;
};

const CreateExportChemicalModal = ({ isOpen, initData, columns, onClose }: CreateExportChemicalModalProps) => {
	const [createdRow, setCreatedRow] = useState<any>(dummyExportChemicalData);
	const chemicalData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
	const exportChemicalData = useAppSelector((state: RootState) => state.exportChemical.listOfExportChemical);

	const [listChemicalAmount, setListChemicalAmount] = useState<any>([]);
	const [chemicalAmount, setChemicalAmount] = useState<any>({ ChemicalId: '', Amount: 0 });
	const dispatch = useAppDispatch();

	const handleSubmit = async () => {
		const newExportChemicals = listChemicalAmount.map((el: any) => {
			const data: IExportChemicalType = {
				ExportId: createdRow.ExportId,
				ChemicalId: el.ChemicalId,
				Amount: el.Amount,
			};
			return data;
		});
		
		const resData = await postExportChemicals(newExportChemicals);
		console.log(resData)
		if (Object.keys(resData).length !== 0) {
			const newListOfExportChemical: IExportChemicalType[] = await getExportChemical();
			if (newListOfExportChemical) {
				dispatch(setSnackbarMessage('Tạo thông tin thành công'));
				dispatch(setListOfExportChemical(newListOfExportChemical));
			}
		} else {
			dispatch(setSnackbarMessage('Tạo thông tin không thành công'));
		}
		onClose();
	};

	useEffect(() => {
		setCreatedRow((prev: any) => ({...prev, ExportId: initData.ExportId}))
	}, [initData])

	return (
		<Dialog open={isOpen} PaperProps={{ style: { width: '700px', maxWidth: 'unset' } }}>
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
							if (column.accessorKey === 'ExportId') {
								return (
									<TextField
										key={column.accessorKey}
										disabled
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.accessorKey && initData["ExportId"]}
									/>
								);
							} else if (column.accessorKey === 'ChemicalId') {
								const list = chemicalData.map((x) => {
									const isExistInListAdded =
									listChemicalAmount.findIndex((y: any) => y.ChemicalId === x.ChemicalId) === -1;
									const isExistInListData =
									exportChemicalData.findIndex(
											y => y.ChemicalId === x.ChemicalId && y.ExportId === initData['ExportId'],
										) === -1;
									if (isExistInListAdded && isExistInListData) {
										return {
											label: `${x.ChemicalId} - ${x.ChemicalName}`,
											id: x.ChemicalId,
											name: x.ChemicalName,
											unit: x.Unit
										};
									}
								}).filter(x => x !== undefined)

								return (
									<FormControl key={column.accessorKey}>
										<Box>
											<Grid container spacing={1}>
												<Grid item xs={8}>
												<Autocomplete
														key={column.id}
														noOptionsText="Không có kết quả trùng khớp"
														options={list}
														defaultValue={
															list.find(x => x?.id === chemicalAmount['ChemicalId']) || null
														}
														value={list.find(x => x?.id === chemicalAmount['ChemicalId']) || null}
														getOptionLabel={option => option?.label || ""}
														renderInput={params => {
															return (
																<TextField
																	{...params}
																	label="Hóa chất"
																	placeholder="Nhập để tìm kiếm"
																/>
															);
														}}
														onChange={(event, value) => {
															setChemicalAmount((prev: any) => ({
																...prev,
																ChemicalId: value?.id,
																ChemicalName: value?.name,
																Unit: value?.unit
															}));
														}}
													/>
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
												<Grid item xs={1}>
													<Box height='100%' display='flex' alignItems='center' justifyContent='center'>{chemicalAmount.Unit && `(${chemicalAmount.Unit})`} </Box>
												</Grid>
											</Grid>
											<Button
												aria-label="delete"
												color="primary"
												variant="contained"
												sx={{ float: 'right', marginTop: '8px' }}
												onClick={() => {
													setListChemicalAmount((prev: any) => [...prev, chemicalAmount]);
													setChemicalAmount({ ChemicalId: '', Amount: 0 });
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
							<Table size="small" aria-label="simple table">
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
											<TableCell>{el.Amount} {el.Unit}</TableCell>
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
				<Button onClick={onClose}>Huỷ</Button>
				<Button color="primary" onClick={handleSubmit} variant="contained" disabled={listChemicalAmount.length === 0}>
					Tạo
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateExportChemicalModal;
