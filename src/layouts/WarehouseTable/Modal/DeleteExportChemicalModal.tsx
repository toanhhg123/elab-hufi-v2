import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setSnackbarMessage } from '../../../pages/appSlice';
import { deleteExportChemical } from '../../../services/exportChemicalServices';
import { RootState } from '../../../store';
import { setListOfExportChemical } from '../../ExportChemicalTable/exportChemicalSlice';

type DeleteExportChemicalModalProps = {
	isOpen: boolean;
	onClose: () => void;
	initData: any;
};

const DeleteExportChemicalModal = ({ isOpen, onClose, initData }: DeleteExportChemicalModalProps) => {
	const [deletedRow, setDeletedRow] = useState<any>(() => initData);
	const exportChemicalData = useAppSelector((state: RootState) => state.exportChemical.listOfExportChemical);
    const dispatch = useAppDispatch()

	const handleSubmit = async () => {
		try {
			const data = await deleteExportChemical(deletedRow.ExportId, deletedRow.ChemicalId);
			if (data) {
				dispatch(setSnackbarMessage('Xóa thông tin thành công'));
				let deletedIdx = exportChemicalData.findIndex(
					x => x.ExportId === deletedRow.ExportId && x.ChemicalId === deletedRow.ChemicalId,
				);
				let newListOfExportChemical = [
					...exportChemicalData.slice(0, deletedIdx),
					...exportChemicalData.slice(deletedIdx + 1),
				];
				dispatch(setListOfExportChemical(newListOfExportChemical));
			} else {
				dispatch(setSnackbarMessage('Xóa thông tin không thành công'));
			}
		} catch (error) {
			console.log(2);
		}

		onClose()
	};

	return (
		<>
			<Dialog open={isOpen}>
				<DialogTitle textAlign="center">
					<b>Xoá thông tin hóa chất</b>
				</DialogTitle>
				<DialogContent>
					<div>
						Bạn có chắc muốn xoá thông tin phiếu xuất hóa chất{' '}
						<Typography component="span" color="red">
							{deletedRow.ExportId} - {deletedRow.ChemicalId} - {deletedRow.ChemicalName}
						</Typography>{' '}
						không?
					</div>
				</DialogContent>
				<DialogActions sx={{ p: '1.25rem' }}>
					<Button onClick={() => onClose}>Huỷ</Button>
					<Button color="primary" onClick={handleSubmit} variant="contained">
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default DeleteExportChemicalModal;
