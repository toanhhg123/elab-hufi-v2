import { Box, Button, debounce, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { MRT_ColumnDef } from 'material-react-table';
import { FC, useEffect, useRef, useState } from 'react';
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
    handleSubmit: (updateData: any) => void
};

const EditExportChemicalModal: FC<EditExportChemicalModalProps> = ({
	isOpen,
	columns,
	onClose,
	initData,
    handleSubmit,
}: EditExportChemicalModalProps) => {
	const [updatedRow, setUpdatedRow] = useState<any>(() => initData);
	const exportChemicalData = useAppSelector((state: RootState) => state.exportChemical.listOfExportChemical);
	const chemicalsData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
	const dispatch = useAppDispatch();
	const [isValid, setIsValid] = useState<boolean>(false);

	useEffect(() => {
		if(Number(updatedRow?.AmountOriginal) > 0) {
			setIsValid(true)
		} else {
			setIsValid(false)
		}
	}, [updatedRow])

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
							if (column.accessorKey === 'ExportId' || column.accessorKey === 'ExpChemDeptId') {
								return (
									<TextField
										disabled
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										value={column.accessorKey && updatedRow[column.accessorKey]}
									/>
								);
							} else if (column.accessorKey === 'AmountOriginal') {
								let unitChemical = updatedRow?.Unit
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
				<Button color="primary" onClick={() => handleSubmit(updatedRow)} disabled={!isValid} variant="contained">
					Lưu thay đổi
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditExportChemicalModal;