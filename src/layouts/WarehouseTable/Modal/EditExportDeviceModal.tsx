import {
	Box,
	Button,
	debounce,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
} from '@mui/material';
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
	const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
	const dispatch = useAppDispatch();
	const [isValid, setIsValid] = useState<boolean>(false);

	useEffect(() => {
		if(Number(updatedRow?.Quantity) > 0) {
			setIsValid(true)
		} else {
			setIsValid(false)
		}
	}, [updatedRow])

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
								let unitDevice = deviceData.find(x => x.DeviceId === updatedRow?.DeviceId)?.Unit;
								return (
									<Box display="flex" alignItems="center">
										<TextField
											key={column.accessorKey}
											label={column.header}
											name={column.accessorKey}
											sx={{flex: 1}}
											error={!isValid}
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
										<Typography mx={2}>{unitDevice && `(${unitDevice})`}</Typography>
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

export default EditExportDeviceModal;
