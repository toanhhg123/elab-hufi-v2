import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Tooltip,
	Typography
} from '@mui/material';
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setSnackbarMessage } from '../../pages/appSlice';
import {
	deleteExportDevice,
	getExportDevice,
	postExportDevices,
	putExportDevice
} from '../../services/exportDeviceServices';
import { RootState } from '../../store';
import { dummyExportDevice, IExportDeviceType } from '../../types/exportDeviceType';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import { setListOfExportDevice } from './exportDeviceSlice';

const ExportDeviceTable: FC = () => {
	const exportDeviceData = useAppSelector((state: RootState) => state.exportDevice.listOfExportDevice);
	const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);

	const [isCreateModal, setIsCreateModal] = useState(false);
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
	const [tableData, setTableData] = useState<IExportDeviceType[]>([]);
	const [validationErrors, setValidationErrors] = useState<{
		[cellId: string]: string;
	}>({});

	const dispatch = useAppDispatch();

	const [updatedRow, setUpdatedRow] = useState<any>(dummyExportDevice);
	const [deletedRow, setDeletedRow] = useState<any>(dummyExportDevice);

	useEffect(() => {
		let formatedDeviceData = exportDeviceData.map((x: IExportDeviceType) => {
			let deviceIdx = deviceData.findIndex(y => y.DeviceId === x.DeviceId);
			return {
				...x,
				DeviceName: deviceIdx > -1 ? deviceData[deviceIdx].DeviceName : '',
				Origin: deviceIdx > -1 ? deviceData[deviceIdx].Origin : '',
				Model: deviceIdx > -1 ? deviceData[deviceIdx].Model : '',
			};
		});
		setTableData(formatedDeviceData);
	}, [exportDeviceData]);

	const getCommonEditTextFieldProps = useCallback(
		(cell: MRT_Cell<IExportDeviceType>): MRT_ColumnDef<IExportDeviceType>['muiTableBodyCellEditTextFieldProps'] => {
			return {
				error: !!validationErrors[cell.id],
				helperText: validationErrors[cell.id],
			};
		},
		[validationErrors],
	);

	const columns = useMemo<MRT_ColumnDef<IExportDeviceType>[]>(
		() => [
			{
				accessorKey: 'ExportId',
				header: 'ID',
				size: 100,
				enableColumnOrdering: true,
				enableEditing: false,
				enableSorting: false,
			},
			{
				accessorKey: 'DeviceId',
				header: 'Mã Thiết bị',
				enableEditing: false,
				size: 140,
			},
			{
				accessorKey: 'DeviceName',
				header: 'Tên thiết bị',
				size: 140,
			},
			{
				accessorKey: 'Quantity',
				header: 'Số lượng',
				size: 140,
			},
			{
				accessorKey: 'Origin',
				header: 'Xuất xứ',
				size: 140,
			},
			{
				accessorKey: 'Model',
				header: 'Mẫu',
				size: 140,
			},
		],
		[getCommonEditTextFieldProps],
	);

	const handleOpenDeleteModal = (row: any) => {
		setDeletedRow(row.original);
		setIsDeleteModal(true);
	};

	const onCloseDeleteModal = () => {
		setDeletedRow(dummyExportDevice);
		setIsDeleteModal(false);
	};

	const handleSubmitDeleteModal = async () => {
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

		onCloseDeleteModal();
	};

	const handleOpenCreateModal = (row: any) => {
		setIsCreateModal(true);
	};

	const onCloseCreateModal = () => {
		setIsCreateModal(false);
	};

	const handleSubmitCreateModal = async (createdRow: any, listChemicalAmount: []) => {
		const newExportChemicals = listChemicalAmount.map((el: any) => {
			const data: IExportDeviceType = {
				ExportId: createdRow.ExportId,
				DeviceId: el.DeviceId,
				Quantity: el.Quantity,
			};
			return data;
		});
		const resData = await postExportDevices(newExportChemicals);
		if (Object.keys(resData).length !== 0) {
			const newListOfExportChemical: IExportDeviceType[] = await getExportDevice();
			if (newListOfExportChemical) {
				dispatch(setSnackbarMessage('Tạo thông tin thành công'));
				dispatch(setListOfExportDevice(newListOfExportChemical));
			}
		} else {
			dispatch(setSnackbarMessage('Tạo thông tin không thành công'));
		}
		onCloseCreateModal();
	};

	const handleOpenEditModal = (row: any) => {
		setUpdatedRow(row.original);
		setIsEditModal(true);
	};

	const onCloseEditModal = () => {
		setUpdatedRow(dummyExportDevice);
		setIsEditModal(false);
	};

	const handleSubmitEditModal = async (updatedRowComplete: any) => {
		const updateData: IExportDeviceType = {
			DeviceId: updatedRowComplete.DeviceId.toString(),
			Quantity: Number(updatedRowComplete.Quantity),
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
		onCloseEditModal();
	};

	return (
		<>
			<MaterialReactTable
				displayColumnDefOptions={{
					'mrt-row-actions': {
						header: 'Các hành động',
						muiTableHeadCellProps: {
							align: 'center',
						},
						muiTableBodyCellProps: {
							align: 'center',
						},
					},
					'mrt-row-numbers': {
						muiTableHeadCellProps: {
							align: 'center',
						},
						muiTableBodyCellProps: {
							align: 'center',
						},
					}
				}}
				columns={columns}
				data={tableData}
				editingMode="modal" //default
				enableColumnOrdering
				enableEditing
				enableRowNumbers
				enablePinning
				initialState={{
					density: 'compact',
					columnOrder: [
						'mrt-row-numbers',
						...columns.map(x => x.accessorKey || ''),
						'mrt-row-actions'
					]
				}}
				renderTopToolbarCustomActions={() => (
					<h3 style={{ margin: '0px' }}>
						<b>
							<KeyboardArrowRightIcon
								style={{ margin: '0px', fontSize: '30px', paddingTop: '15px' }}
							></KeyboardArrowRightIcon>
						</b>
						<span>Quản lý phiếu xuất thiết bị</span>
					</h3>
				)}
				renderRowActions={({ row, table }) => (
					<>
						<Tooltip arrow placement="left" title="Sửa thông tin">
							<IconButton onClick={() => handleOpenEditModal(row)}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip arrow placement="right" title="Xoá">
							<IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
								<Delete />
							</IconButton>
						</Tooltip>
					</>
				)}
				renderBottomToolbarCustomActions={() => (
					<Tooltip title="Tạo Lab mới" placement="right-start">
						<Button
							color="primary"
							onClick={handleOpenCreateModal}
							variant="contained"
							style={{ margin: '10px' }}
						>
							<AddIcon fontSize="small" />
						</Button>
					</Tooltip>
				)}
			/>

			<Dialog open={isDeleteModal}>
				<DialogTitle textAlign="center">
					<b>Xoá thông tin Lab</b>
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
					<Button onClick={onCloseDeleteModal}>Huỷ</Button>
					<Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>

			{isCreateModal && (
				<CreateModal
					onCloseCreateModal={onCloseCreateModal}
					columns={columns}
					isCreateModal={isCreateModal}
					handleSubmitCreateModal={handleSubmitCreateModal}
				/>
			)}

			{isEditModal && (
				<EditModal
					initData={updatedRow}
					isEditModal={isEditModal}
					columns={columns}
					onCloseEditModal={onCloseEditModal}
					handleSubmitEditModal={handleSubmitEditModal}
				/>
			)}
		</>
	);
};

export default ExportDeviceTable;
