import { Button, debounce, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { MRT_ColumnDef } from 'material-react-table';
import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setSnackbarMessage } from '../../../pages/appSlice';
import { putExportDevice } from '../../../services/exportDeviceServices';
import { RootState } from '../../../store';
import { IExportDeviceType } from '../../../types/exportDeviceType';
import { setListOfExportDevice } from '../../ExportDeviceTable/exportDeviceSlice';

type EditExportDeviceModalProps = {
	isOpen: boolean;
	columns: MRT_ColumnDef<IExportDeviceType>[];
	onClose: () => void;
	initData: any;
};

const EditExportDeviceModal: FC<EditExportDeviceModalProps> = ({
	isOpen,
	columns,
	onClose,
	initData,
}: EditExportDeviceModalProps) => {
	const [updatedRow, setUpdatedRow] = useState<any>(() => initData);
	const exportDeviceData = useAppSelector((state: RootState) => state.exportDevice.listOfExportDevice);
	const dispatch = useAppDispatch();

	const handleSubmit = async () => {
		const updateData: IExportDeviceType = {
			DeviceId: updatedRow.DeviceId.toString(),
			Quantity: Number(updatedRow.Quantity),
			ExportId: updatedRow.ExportId,
		};
		const resData = await putExportDevice(updatedRow.ExportId, updatedRow.DeviceId, updateData);

		if (Object.keys(resData).length !== 0) {
			dispatch(setSnackbarMessage('Cập nhật thành công'));
			let updatedIdx = exportDeviceData.findIndex(
				x => x.DeviceId === updatedRow.DeviceId && x.ExportId === updatedRow.ExportId,
			);
			let newListOfDeviceSpecs = [
				...exportDeviceData.slice(0, updatedIdx),
				updateData,
				...exportDeviceData.slice(updatedIdx + 1),
			];
			dispatch(setListOfExportDevice(newListOfDeviceSpecs));
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
				<b>Sửa thông tin phiếu xuất thiết bị</b>
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
							if (column.accessorKey === 'ExportId' || column.accessorKey === 'DeviceId') {
								return (
									<TextField
										disabled
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										value={column.accessorKey && updatedRow[column.accessorKey]}
									/>
								);
							} else if (column.accessorKey === 'Quantity') {
								console.log(updatedRow[column.accessorKey]);
								return (
									<TextField
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
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
								);
							}
						})}
					</Stack>
				</form>
			</DialogContent>
			<DialogActions sx={{ p: '1.25rem' }}>
				<Button onClick={onClose}>Huỷ</Button>
				<Button color="primary" onClick={handleSubmit} variant="contained">
					Lưu thay đổi
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditExportDeviceModal;
