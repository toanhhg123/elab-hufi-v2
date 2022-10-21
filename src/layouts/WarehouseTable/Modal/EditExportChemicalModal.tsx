import { Box, Button, debounce, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { MRT_ColumnDef } from 'material-react-table';
import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setSnackbarMessage } from '../../../pages/appSlice';
import { putExportChemical } from '../../../services/exportChemicalServices';
import { RootState } from '../../../store';
import { IExportChemicalType } from '../../../types/exportChemicalType';
import { setListOfExportChemical } from '../../ExportChemicalTable/exportChemicalSlice';

type EditExportChemicalModalProps = {
	isOpen: boolean;
	columns: MRT_ColumnDef<IExportChemicalType>[];
	onClose: () => void;
	initData: any;
};

const EditExportChemicalModal: FC<EditExportChemicalModalProps> = ({
	isOpen,
	columns,
	onClose,
	initData,
}: EditExportChemicalModalProps) => {
	const [updatedRow, setUpdatedRow] = useState<any>(() => initData);
	const exportChemicalData = useAppSelector((state: RootState) => state.exportChemical.listOfExportChemical);
	const chemicalsData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
	const dispatch = useAppDispatch();
	const [isValid, setIsValid] = useState<boolean>(false);

	useEffect(() => {
		if(Number(updatedRow?.Amount) > 0) {
			setIsValid(true)
		} else {
			setIsValid(false)
		}
	}, [updatedRow])

	const handleSubmit = async () => {
		const updateData: IExportChemicalType = {
			ChemicalId: updatedRow.ChemicalId.toString(),
			Amount: Number(updatedRow.Amount),
			ExportId: updatedRow.ExportId,
		};
		const resData = await putExportChemical(updatedRow.ExportId, updatedRow.ChemicalId, updateData);

		if (Object.keys(resData).length !== 0) {
			dispatch(setSnackbarMessage('Cập nhật thành công'));
			let updatedIdx = exportChemicalData.findIndex(
				x => x.ChemicalId === updatedRow.ChemicalId && x.ExportId === updatedRow.ExportId,
			);
			let newListOfDeviceSpecs = [
				...exportChemicalData.slice(0, updatedIdx),
				updateData,
				...exportChemicalData.slice(updatedIdx + 1),
			];
			dispatch(setListOfExportChemical(newListOfDeviceSpecs));
		} else {
			dispatch(setSnackbarMessage('Cập nhật không thành công'));
		}
		onClose();
	};

	useEffect(() => {
		setUpdatedRow(initData);
	}, [isOpen, initData]);

	return (
		<Dialog open={isOpen}>
			<DialogTitle textAlign="center">
				<b>Sửa thông tin phiếu xuất hóa chất</b>
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
							if (column.accessorKey === 'ExportId' || column.accessorKey === 'ChemicalId') {
								return (
									<TextField
										disabled
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										value={column.accessorKey && updatedRow[column.accessorKey]}
									/>
								);
							} else if (column.accessorKey === 'Amount') {
								let unitChemical = chemicalsData.find(x => x.ChemicalId === updatedRow?.ChemicalId)?.Unit
								return (
									<Box display='flex' alignItems='center'  >
										<TextField
											error={!isValid}
											key={column.accessorKey}
											label={column.header}
											name={column.accessorKey}
											sx={{flex: 1}}
											type="number"
											inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
											InputProps={{ inputProps: { min: 1 } }}
											defaultValue={column.accessorKey && updatedRow[column.accessorKey]}
											onChange={debounce(
												e =>
													setUpdatedRow({
														...updatedRow,
														[e.target.name]: e.target.value,
													}),
												200,
											)}
										/>
										<Typography mx={2}>{unitChemical && `(${unitChemical})`}</Typography>
									</Box>
								);
							}
						})}
					</Stack>
				</form>
			</DialogContent>
			<DialogActions sx={{ p: '1.25rem' }}>
				<Button onClick={onClose}>Huỷ</Button>
				<Button color="primary" onClick={handleSubmit} disabled={!isValid} variant="contained">
					Lưu thay đổi
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditExportChemicalModal;
