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
import { Box } from '@mui/system';
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
import { setListOfWarehouseRegisterGeneral } from '../../warehouseSlice';

const RegisterGeneralTabItem: FC = () => {
	const warehouseRegisterGeneral = useAppSelector(
		(state: RootState) => state.warehouse.listOfWarehouseRegisterGeneral,
	);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const registerGeneralsData = useAppSelector((state: RootState) => state.registerGeneral.listOfRegisterGeneral);

	const [isCreateModal, setIsCreateModal] = useState(false);
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
	const [tableData, setTableData] = useState<IWarehouseType[]>([]);
	const [validationErrors, setValidationErrors] = useState<{
		[cellId: string]: string;
	}>({});

	const dispatch = useAppDispatch();

	const [updatedRow, setUpdatedRow] = useState<any>(dummyWarehouseData);
	const [deletedRow, setDeletedRow] = useState<any>(dummyWarehouseData);

	useEffect(() => {
		let formatedDeviceData = warehouseRegisterGeneral.map((x: IWarehouseType) => {
			let employeeInfoIdx = employeeData.findIndex(y => y.EmployeeID === x.EmployeeId);
			let registerGeneralInfoIdx = registerGeneralsData.findIndex(
				y => y.RegisterGeneralId === x.RegisterGeneralId,
			);
			return {
				...x,
				EmployeeName: employeeInfoIdx > -1 ? employeeData[employeeInfoIdx].Fullname : '',
				Instructor: registerGeneralInfoIdx > -1 ? registerGeneralsData[registerGeneralInfoIdx].Instructor : '',
				ThesisName: registerGeneralInfoIdx > -1 ? registerGeneralsData[registerGeneralInfoIdx].ThesisName : '',
				ResearchSubject:
					registerGeneralInfoIdx > -1 ? registerGeneralsData[registerGeneralInfoIdx].ResearchSubject : '',
				formatedExportDate: moment.unix(x.ExportDate).format('DD/MM/YYYY'),
			};
		});
		setTableData(formatedDeviceData);
	}, [warehouseRegisterGeneral]);

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
				header: 'Người xuát',
				size: 140,
			},
			{
				accessorKey: 'Instructor',
				header: 'Người hướng dẫn',
				size: 140,
			},

			{
				accessorKey: 'ThesisName',
				header: 'ThesisName',
				size: 140,
			},
			{
				accessorKey: 'ResearchSubject',
				header: 'Đối tượng nghiên cứu',
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
			RegisterGeneralId: updatedRow.RegisterGeneralId,
		};

		const resData = await updateWarehouse('reg', updatedRow.ExportId, updateData);

		if (Object.keys(resData).length !== 0) {
			dispatch(setSnackbarMessage('Cập nhật thông tin thành công'));
			let updatedIdx = warehouseRegisterGeneral.findIndex(
				x => x.ExportId === updatedRow.ExportId && x.RegisterGeneralId === updatedRow.RegisterGeneralId,
			);
			let newListOfRegisterGeneral = [
				...warehouseRegisterGeneral.slice(0, updatedIdx),
				updatedRow,
				...warehouseRegisterGeneral.slice(updatedIdx + 1),
			];
			dispatch(setListOfWarehouseRegisterGeneral(newListOfRegisterGeneral));
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
			const resData = await deleteWarehouse(deletedRow.ExportId);
			if (resData) {
				dispatch(setSnackbarMessage('Xóa thông tin thành công'));
				let deletedIdx = warehouseRegisterGeneral.findIndex(x => x.ExportId === deletedRow.ExportId);
				let newListOfLabs = [
					...warehouseRegisterGeneral.slice(0, deletedIdx),
					...warehouseRegisterGeneral.slice(deletedIdx + 1),
				];
				dispatch(setListOfWarehouseRegisterGeneral(newListOfLabs));
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
				RegisterGeneralId: createdRow.RegisterGeneralId,
			};

			const resData = await postWarehouse('reg', createData);

			if (Object.keys(resData).length !== 0) {
				const newListOfRegisterGeneral: IWarehouseType[] = await getWarehouseFeildId('reg');
				if (newListOfRegisterGeneral) {
					dispatch(setSnackbarMessage('Tạo thông tin mới thành công'));
					dispatch(setListOfWarehouseRegisterGeneral(newListOfRegisterGeneral));
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
						size: 120,
					},
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
				}}
				renderTopToolbarCustomActions={() => (
					<h3 style={{ margin: '0px' }}>
						<b>
							<KeyboardArrowRightIcon
								style={{ margin: '0px', fontSize: '30px', paddingTop: '15px' }}
							></KeyboardArrowRightIcon>
						</b>
						<span>Quản lý phiếu xuất đăng kí chung</span>
					</h3>
				)}
				renderRowActions={({ row, table }) => (
					<Box sx={{ display: 'flex', gap: '1rem' }}>
						<Tooltip arrow placement="left" title="Sửa thông tin Lab">
							<IconButton onClick={() => handleOpenEditModal(row)}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip arrow placement="right" title="Xoá Lab">
							<IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
								<Delete />
							</IconButton>
						</Tooltip>
					</Box>
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

export default RegisterGeneralTabItem;
