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
	Typography,
} from '@mui/material';
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { setSnackbarMessage } from '../../../../pages/appSlice';
import {
	deleteWarehouse,
	getWarehouseFeildId,
	postWarehouse,
	updateWarehouse,
} from '../../../../services/warehouseServices';
import { RootState } from '../../../../store';
import { dummyWarehouseData, IWarehouseType } from '../../../../types/warehouseType';
import CreateLabModal from '../../Modal/CreateLabModal';
import EditLabModal from '../../Modal/EditLabModal';
import { setListOfWarehouseLaboratory } from '../../warehouseSlice';

const LaboratoryTabItem: FC = () => {
	const warehouseLaboratoriesData = useAppSelector((state: RootState) => state.warehouse.listOfWarehouseLaboratory);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
	const dispatch = useAppDispatch();

	const [isCreateModal, setIsCreateModal] = useState(false);
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
	const [tableData, setTableData] = useState<IWarehouseType[]>([]);
	const [validationErrors, setValidationErrors] = useState<{
		[cellId: string]: string;
	}>({});

	const [updatedRow, setUpdatedRow] = useState<any>(dummyWarehouseData);
	const [deletedRow, setDeletedRow] = useState<any>(dummyWarehouseData);

	useEffect(() => {
		let formatedDeviceData = warehouseLaboratoriesData.map((x: IWarehouseType) => {
			let employeeInfoIdx = employeeData.findIndex(y => y.EmployeeID === x.EmployeeId);
			let laboratoryInfoIdx = laboratoriesData.findIndex(y => y.LabId === x.LabId);
			return {
				...x,
				EmployeeName: employeeInfoIdx > -1 ? employeeData[employeeInfoIdx].Fullname : '',
				LabName: laboratoryInfoIdx > -1 ? laboratoriesData[laboratoryInfoIdx].LabName : '',
				formatedExportDate: moment.unix(x.ExportDate).format('DD/MM/YYYY'),
			};
		});
		setTableData(formatedDeviceData);
	}, [warehouseLaboratoriesData]);

	const getCommonEditTextFieldProps = useCallback(
		(cell: MRT_Cell<IWarehouseType>): MRT_ColumnDef<IWarehouseType>['muiTableBodyCellEditTextFieldProps'] => {
			return {
				error: !!validationErrors[cell.id],
				helperText: validationErrors[cell.id],
			};
		},
		[validationErrors],
	);

	const columns = useMemo<MRT_ColumnDef<IWarehouseType>[]>(
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
				accessorKey: 'formatedExportDate',
				header: 'Thời gian xuất',
				size: 140,
			},
			{
				accessorKey: 'Content',
				header: 'Nội dung',
				size: 140,
			},
			{
				accessorKey: 'Status',
				header: 'Trạng thái',
				size: 140,
			},
			{
				accessorKey: 'EmployeeName',
				header: 'Người xuất',
				size: 140,
			},
			{
				accessorKey: 'LabName',
				header: 'Phòng',
				size: 140,
			},
		],
		[getCommonEditTextFieldProps],
	);

	const handleOpenEditModal = (row: any) => {
		setUpdatedRow(row.original);
		setIsEditModal(true);
	};

	const onCloseEditModal = () => {
		setUpdatedRow(dummyWarehouseData);
		setIsEditModal(false);
	};

	const handleSubmitEditModal = async (updatedRow: any) => {
		const updateData = {
			ExportId: updatedRow.ExportId,
			ExportDate: moment.unix(updatedRow.ExportDate).format('YYYY-MM-DD'),
			Content: updatedRow.Content,
			Status: updatedRow.Status,
			EmployeeId: updatedRow.EmployeeId,
			LabId: updatedRow.LabId,
		};
		const resData = await updateWarehouse('lab', updatedRow.ExportId, updateData);
		if (Object.keys(resData).length !== 0) {
			dispatch(setSnackbarMessage('Cập nhật thông tin thành công'));
			let updatedIdx = warehouseLaboratoriesData.findIndex(
				x => x.ExportId === updatedRow.ExportId && x.LabId === updatedRow.LabId,
			);
			let newListOfLabs = [
				...warehouseLaboratoriesData.slice(0, updatedIdx),
				updatedRow,
				...warehouseLaboratoriesData.slice(updatedIdx + 1),
			];
			dispatch(setListOfWarehouseLaboratory(newListOfLabs));
		} else {
			dispatch(setSnackbarMessage('Cập nhật thông tin không thành công'));
		}

		onCloseEditModal();
	};

	const handleOpenDeleteModal = (row: any) => {
		setDeletedRow(row.original);
		setIsDeleteModal(true);
	};

	const onCloseDeleteModal = () => {
		setDeletedRow(dummyWarehouseData);
		setIsDeleteModal(false);
	};

	const handleSubmitDeleteModal = async () => {
		try {
			const data = await deleteWarehouse(deletedRow.ExportId);
			if (data) {
				dispatch(setSnackbarMessage('Xóa thông tin thành công'));
				let deletedIdx = warehouseLaboratoriesData.findIndex(x => x.ExportId === deletedRow.ExportId);
				let newListOfLabs = [
					...warehouseLaboratoriesData.slice(0, deletedIdx),
					...warehouseLaboratoriesData.slice(deletedIdx + 1),
				];
				dispatch(setListOfWarehouseLaboratory(newListOfLabs));
			} else {
				dispatch(setSnackbarMessage('Xóa thông tin không thành công'));
			}
		} catch (error) {
			dispatch(setSnackbarMessage('Xóa thông tin không thành công'));
		}
		onCloseDeleteModal();
	};

	const handleOpenCreateModal = (row: any) => {
		setIsCreateModal(true);
	};

	const onCloseCreateModal = () => {
		setIsCreateModal(false);
	};

	const handleSubmitCreateModal = async (createdRow: any) => {
		try {
			const createData = {
				ExportId: createdRow.ExportId,
				ExportDate: moment.unix(createdRow.ExportDate / 1000).format('YYYY-MM-DD'),
				Content: createdRow.Content,
				Status: createdRow.Status,
				EmployeeId: createdRow.EmployeeId,
				LabId: createdRow.LabId,
			};

			const resData = await postWarehouse('lab', createData);
			
			if (Object.keys(resData).length !== 0) {
				const newListOfLaboratories: IWarehouseType[] = await getWarehouseFeildId('lab');
				if (newListOfLaboratories) {
					dispatch(setSnackbarMessage('Tạo thông tin phòng lab mới thành công'));
					dispatch(setListOfWarehouseLaboratory(newListOfLaboratories));
				}
			} else {
				dispatch(setSnackbarMessage('Tạo thông tin mới không thành công'));
			}
		} catch (error) {
			dispatch(setSnackbarMessage('Tạo thông tin mới không thành công'));
		}

		onCloseCreateModal();
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
						<span>Quản lý phiếu xuất phòng thí nghiệm</span>
					</h3>
				)}
				renderRowActions={({ row, table }) => (
					<>
						<Tooltip arrow placement="left" title="Sửa thông tin phiếu xuất phòng thí nghiệm">
							<IconButton onClick={() => handleOpenEditModal(row)}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip arrow placement="right" title="Xoá phiếu xuất phòng thí nghiệm">
							<IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
								<Delete />
							</IconButton>
						</Tooltip>
					</>
				)}
				renderBottomToolbarCustomActions={() => (
					<Tooltip title="Tạo phiếu xuất phòng thí nghiệm mới" placement="right-start">
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
					<b>Xoá thông tin phiếu xuất phòng thí nghiệm</b>
				</DialogTitle>
				<DialogContent>
					<div>
						Bạn có chắc muốn xoá thông tin{' '}
						<Typography component="span" color="red">
							{deletedRow.ExportId} - {deletedRow.Content} - {deletedRow.EmployeeName}
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
				<CreateLabModal
					onCloseCreateModal={onCloseCreateModal}
					columns={columns}
					isCreateModal={isCreateModal}
					handleSubmitCreateModal={handleSubmitCreateModal}
				/>
			)}
			{isEditModal && (
				<EditLabModal
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

export default LaboratoryTabItem;