import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setSnackbarMessage } from '../../../pages/appSlice';
import { deleteExportDevice } from '../../../services/exportDeviceServices';
import { RootState } from '../../../store';
import { setListOfExportDevice } from '../../ExportDeviceTable/exportDeviceSlice';

type DeleteExportDeviceModalProps = {
	isOpen: boolean;
	onClose: () => void;
	initData: any;
};

const DeleteExportDeviceModal = ({ isOpen, onClose, initData }: DeleteExportDeviceModalProps) => {
	const [deletedRow, setDeletedRow] = useState<any>(() => initData);
	const exportDeviceData = useAppSelector((state: RootState) => state.exportDevice.listOfExportDevice);
    const dispatch = useAppDispatch()

	const handleSubmit = async () => {
		try {
			const data = await deleteExportDevice(deletedRow.ExportId, deletedRow.DeviceId);
			if (data) {
				dispatch(setSnackbarMessage('Xóa thông tin thành công'));
				let deletedIdx = exportDeviceData.findIndex(
					x => x.ExportId === deletedRow.ExportId && x.DeviceId === deletedRow.DeviceId,
				);
				let newListOfExportChemical = [
					...exportDeviceData.slice(0, deletedIdx),
					...exportDeviceData.slice(deletedIdx + 1),
				];
				dispatch(setListOfExportDevice(newListOfExportChemical));
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
					<b>Xoá thông tin thiết bị</b>
				</DialogTitle>
				<DialogContent>
					<div>
						Bạn có chắc muốn xoá thông tin phiếu xuất thiết bị{' '}
						<Typography component="span" color="red">
							{deletedRow.ExportId} - {deletedRow.DeviceId} - {deletedRow.DeviceName}
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

export default DeleteExportDeviceModal;
