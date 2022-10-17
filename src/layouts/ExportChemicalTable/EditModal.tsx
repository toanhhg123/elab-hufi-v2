import { MRT_ColumnDef } from 'material-react-table';
import { dummyExportChemicalData, IExportChemicalType } from '../../types/exportChemicalType';
import {
	Button,
	debounce,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { RootState } from '../../store';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ContentPasteOffOutlined } from '@mui/icons-material';
import { putExportChemical } from '../../services/exportChemicalServices';
import { setSnackbarMessage } from '../../pages/appSlice';
import { setListOfExportChemical } from './exportChemicalSlice';

type CreateModalProps = {
	isEditModal: boolean;
	columns: MRT_ColumnDef<IExportChemicalType>[];
	onCloseEditModal: React.MouseEventHandler;
	handleSubmitEditModal: Function;
	initData: any;
};

const EditModal: FC<CreateModalProps> = ({
	isEditModal,
	columns,
	onCloseEditModal,
	handleSubmitEditModal,
	initData,
}: CreateModalProps) => {
	const [updatedRow, setUpdatedRow] = useState<any>(() => initData);
	const chemicalsData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
	const exportChemicalData = useAppSelector((state: RootState) => state.exportChemical.listOfExportChemical);
	const dispatch = useAppDispatch();

	const handleSubmit = async () => {
		handleSubmitEditModal(updatedRow);
	};

	useEffect(() => {
		setUpdatedRow(initData);
	}, [isEditModal, initData]);

	return (
		<Dialog open={isEditModal}>
			<DialogTitle textAlign="center">
				<b>Sửa thông tin phiếu xuất {initData.ChemicalId}</b>
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
							if (column.id === 'ExportId' || column.id === 'ChemicalId') {
								return (
									<TextField
										disabled
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										value={column.id && updatedRow[column.id]}
									/>
								);
							} else if (column.id === 'Amount') {
								console.log(updatedRow[column.id]);
								return (
									<TextField
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										type="number"
										inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
										InputProps={{ inputProps: { min: 1 } }}
										defaultValue={column.id && updatedRow[column.id]}
										onChange={debounce(
											(e) =>
												setUpdatedRow({
													...updatedRow,
													[e.target.name]: e.target.value,
												}),
											200,
										)}
									/>
								);
							}
						})}
					</Stack>
				</form>
			</DialogContent>
			<DialogActions sx={{ p: '1.25rem' }}>
				<Button onClick={onCloseEditModal}>Huỷ</Button>
				<Button color="primary" onClick={handleSubmit} variant="contained">
					Lưu thay đổi
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditModal;
