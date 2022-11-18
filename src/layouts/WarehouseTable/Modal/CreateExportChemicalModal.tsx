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
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { dummyExportChemicalData, IExportChemicalType } from '../../../types/exportChemicalType';

type CreateExportChemicalModalProps = {
	isOpen: boolean;
	initData: any;
	columns: MRT_ColumnDef<IExportChemicalType>[];
	onClose: () => void;
	handleSubmit: (list: any, row: any) => void;
	type: string;
};

const CreateExportChemicalModal = ({
	isOpen,
	initData,
	columns,
	onClose,
	handleSubmit,
	type,
}: CreateExportChemicalModalProps) => {
	const [createdRow, setCreatedRow] = useState<any>(dummyExportChemicalData);
	const warehouseDepartment = useAppSelector((state: RootState) => state.warehouse.listOfWarehouseDepartment);
	const [chemicalData, setChemicalData] = useState([]);

	const [listChemicalAmount, setListChemicalAmount] = useState<any>([]);
	const [chemicalAmount, setChemicalAmount] = useState<any>({ ExpChemDeptId: '', ChemDetailId: '', Amount: 0 });
	const dispatch = useAppDispatch();
	const [exportChemicalIdText, setExportChemicalIdText] = useState('');
	const [loading, setLoading] = useState<boolean>(true);

	const handleChangeExportChemicalIdText = (e: ChangeEvent<HTMLInputElement>) =>
		setExportChemicalIdText(e.target.value);

	useEffect(() => {
		let list = [];

		switch (type) {
			case 'DEP':
			case 'REG':
				list = initData?.listChemicalExport || [];
				break;
			case 'SUB':
				list = initData?.listSub || [];
				break;
			default:
				break;
		}
		const listInitChemical = list?.map((chemical: any) => {
			switch (type) {
				case 'DEP':
					case 'REG':
						return {
						ExpChemDeptId: chemical?.ExpChemDeptId,
						ChemDetailId: chemical?.ChemDetailId,
						ChemicalName: chemical?.ChemicalName,
						Amount: chemical?.AmountOriginal || chemical?.Amount || 0,
						Unit: chemical?.Unit,
					};
				case 'SUB':
					return {
						ExpChemDeptId: chemical?.ExpChemDeptId,
						Amount: chemical?.Amount,
						ChemicalName: chemical?.ChemicalName,
						Unit: chemical?.Unit,
					};
					default:
						break;
					}
				});

		setListChemicalAmount(listInitChemical);
	}, [initData]);

	useEffect(() => {
		switch (type) {
			case 'DEP': {
				const getChemicalData = async () => {
					const res = await axios.get('https://aspsite.somee.com/api/chemicals/1');
					const chemicalsDetail: any = [];
					res.data?.forEach((chemical: any) => {
						for (let x of chemical.listChemicalDetail) {
							chemicalsDetail.push({
								ChemicalName: chemical?.ChemicalName,
								ChemDetailId: x?.ChemDetailId,
								Unit: chemical.Unit,
							});
						}
					});
					setChemicalData(chemicalsDetail);
					setLoading(false);
				};

				getChemicalData();
				break;
			}
			case 'SUB':
			case 'REG': {
				const getChemicalData = async () => {
					// const res = await axios.get('https://aspsite.somee.com/api/chemicals/1');
					const chemicalsDetail: any = [];
					warehouseDepartment?.forEach(chemical => {
						if (chemical.Accept === 'Accepted') {
							const listChemicalExport = chemical?.listChemicalExport || [];
							for (let chemicalDetail of listChemicalExport) {
								chemicalsDetail.push({
									ChemicalName: chemicalDetail?.ChemicalName,
									ChemDetailId: chemicalDetail?.ChemDetailId,
									ExpChemDeptId: chemicalDetail?.ExpChemDeptId,
									Unit: chemicalDetail.Unit,
								});
							}
						}
					});
					setChemicalData(chemicalsDetail);
					setLoading(false);
				};
				getChemicalData();
				break;
			}
			default:
				break;
		}
	}, []);

	useEffect(() => {
		setCreatedRow((prev: any) => ({ ...prev, ...initData }));
	}, [initData]);

	return (
		<Dialog open={isOpen} PaperProps={{ style: { width: '850px', maxWidth: 'unset' } }}>
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
							if (
								column.accessorKey === 'ExportId' ||
								column.accessorKey === 'ExpRegGeneralId' ||
								column.accessorKey === 'ExpSubjectId'
							) {
								return (
									<TextField
										key={column.accessorKey}
										disabled
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.accessorKey && initData[column.accessorKey]}
									/>
								);
							} else if (column.accessorKey === 'ExpChemDeptId') {
								const list = chemicalData
									.map((x: any) => {
										return {
											label: `${
												x?.ExpChemDeptId ? `${x?.ExpChemDeptId} - ` : `${x?.ChemDetailId} - `
											}${x?.ChemicalName}`,
											id: type === 'REG' || type === 'SUB' ? x?.ExpChemDeptId : x?.ChemDetailId,
											name: x?.ChemicalName,
											unit: x?.Unit,
										};
									})
									.filter(x => x !== undefined);

								return (
									<Fragment key={column.accessorKey}>
										<TextField
											label={column.header}
											name={column.accessorKey}
											disabled={!chemicalAmount.ChemDetailId || type === 'REG' || type === 'SUB'}
											defaultValue={exportChemicalIdText}
											value={exportChemicalIdText}
											onChange={handleChangeExportChemicalIdText}
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
																	x =>
																		x?.id ===
																		chemicalAmount[
																			type === 'REG' || type === 'SUB'
																				? 'ExpChemDeptId'
																				: 'ChemDetailId'
																		],
																) || null
															}
															value={
																list.find(
																	x =>
																		x?.id ===
																		chemicalAmount[
																			type === 'REG' || type === 'SUB'
																				? 'ExpChemDeptId'
																				: 'ChemDetailId'
																		],
																) || null
															}
															loading={loading}
															getOptionLabel={option => option?.label || ''}
															renderInput={params => {
																return (
																	<TextField
																		{...params}
																		label="Hóa chất"
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
																setExportChemicalIdText(value?.id || '');
																switch (type) {
																	case 'DEP':
																		setChemicalAmount((prev: any) => ({
																			...prev,
																			ChemDetailId: value?.id,
																			ChemicalName: value?.name,
																			Unit: value?.unit,
																		}));
																		break;
																	case 'SUB':
																	case 'REG': {
																		setChemicalAmount((prev: any) => ({
																			...prev,
																			ExpChemDeptId: value?.id,
																			ChemDetailId: '1',
																			ChemicalName: value?.name,
																			Unit: value?.unit,
																		}));
																		break;
																	}
																	default:
																		break;
																}
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
														<Box
															height="100%"
															display="flex"
															alignItems="center"
															justifyContent="center"
														>
															{chemicalAmount.Unit && `(${chemicalAmount.Unit})`}{' '}
														</Box>
													</Grid>
												</Grid>
												<Button
													aria-label="delete"
													color="primary"
													variant="contained"
													sx={{ float: 'right', marginTop: '8px' }}
													disabled={!chemicalAmount?.ChemDetailId}
													onClick={() => {
														setListChemicalAmount((prev: any) => {
															return [
																...prev,
																{
																	...chemicalAmount,
																	ExpChemDeptId: exportChemicalIdText,
																},
															];
														});
														setChemicalAmount({
															ExpChemDeptId: '',
															ChemDetailId: '',
															Amount: 0,
														});
														setExportChemicalIdText('');
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
										<TableCell>Mã hoá chất xuất</TableCell>
										<TableCell>Hóa chất</TableCell>
										<TableCell>SL</TableCell>
										<TableCell></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{listChemicalAmount?.map((el: any, index: number) => (
										<TableRow
											key={index}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{index + 1}
											</TableCell>
											<TableCell>{el?.ExpChemDeptId}</TableCell>
											<TableCell>
												{el?.ChemDetailId || el?.ExpChemDeptId} - {el?.ChemicalName}
											</TableCell>
											<TableCell>
												{el?.Amount} {el?.Unit}
											</TableCell>
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
				<Button
					color="primary"
					onClick={() => handleSubmit(listChemicalAmount, createdRow)}
					variant="contained"
				>
					Tạo
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateExportChemicalModal;
