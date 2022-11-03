import styled from '@emotion/styled';
import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography
} from '@mui/material';
import { Box } from '@mui/system';
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { setSnackbarMessage } from '../../../../pages/appSlice';
import { deleteExportChemical } from '../../../../services/exportChemicalServices';
import { deleteExportDevice } from '../../../../services/exportDeviceServices';
import {
	deleteWarehouse,
	getWarehouseFeildId,
	postWarehouse,
	updateWarehouse
} from '../../../../services/warehouseServices';
import { RootState } from '../../../../store';
import { IChemicalType } from '../../../../types/chemicalType';
import { IExportChemicalType } from '../../../../types/exportChemicalType';
import { IExportDeviceType } from '../../../../types/exportDeviceType';
import { dummyWarehouseData, IWarehouseType } from '../../../../types/warehouseType';
import ChemicalTable from '../../Details/ChemicalTable';
import DeviceTable from '../../Details/DeviceTable';
import CreateExportChemicalModal from '../../Modal/CreateExportChemicalModal';
import CreateExportDeviceModal from '../../Modal/CreateExportDeviceModal';
import CreateExportModal from '../../Modal/CreateExportModal';
import DeleteExportChemicalModal from '../../Modal/DeleteExportChemicalModal';
import DeleteExportDeviceModal from '../../Modal/DeleteExportDeviceModal';
import { DeleteExportModal } from '../../Modal/DeleteExportModal';
import EditExportChemicalModal from '../../Modal/EditExportChemicalModal';
import EditExportDeviceModal from '../../Modal/EditExportDeviceModal';
import EditExportModal from '../../Modal/EditExportModal';
import { setListOfWarehouseRegisterGeneral } from '../../warehouseSlice';

const StyledTableCell = styled(TableCell)(theme => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: 'lightgray',
	},
}));

const RegisterGeneralTabItem: FC = () => {
	const warehouseRegisterGeneral = useAppSelector(
		(state: RootState) => state.warehouse.listOfWarehouseRegisterGeneral,
	);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
	const exportChemicalData = useAppSelector((state: RootState) => state.exportChemical.listOfExportChemical);
	const chemicalsData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
	const nanufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);
	const exportDeviceData = useAppSelector((state: RootState) => state.exportDevice.listOfExportDevice);
	const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
	const registerGeneralsData = useAppSelector((state: RootState) => state.registerGeneral.listOfRegisterGeneral);

	const [isCreateExportChemicalModal, setIsCreateExportChemicalModal] = useState<boolean>(false);
	const [isEditExportChemicalModal, setIsEditExportChemicalModal] = useState<boolean>(false);
	const [isDeleteExportChemicalModal, setIsDeleteExportChemicalModal] = useState<boolean>(false);
	const [isCreateExportDeviceModal, setIsCreateExportDeviceModal] = useState<boolean>(false);
	const [isEditExportDeviceModal, setIsEditExportDeviceModal] = useState<boolean>(false);
	const [isDeleteExportDeviceModal, setIsDeleteExportDeviceModal] = useState<boolean>(false);
	const [isCreateModal, setIsCreateModal] = useState<boolean>(false);
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
	const [tableData, setTableData] = useState<IWarehouseType[]>([]);
	const [validationErrors, setValidationErrors] = useState<{
		[cellId: string]: string;
	}>({});

	const dispatch = useAppDispatch();

	const [createdRow, setCreatedRow] = useState<any>(dummyWarehouseData);
	const [updatedRow, setUpdatedRow] = useState<any>(dummyWarehouseData);
	const [deletedRow, setDeletedRow] = useState<any>(dummyWarehouseData);

	useEffect(() => {
		let formatedData = warehouseRegisterGeneral.map((x: IWarehouseType) => {
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
		formatedData.sort((x, y) => y.ExportDate - x.ExportDate)
		setTableData(formatedData);
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
				header: 'Người xuất',
				size: 140,
				enableHiding: false,
			},
			{
				accessorKey: 'EmployeeId',
				header: 'EmployeeId',
				size: 140,
			},
			{
				accessorKey: 'RegisterGeneralId',
				header: 'RegisterGeneralId',
				size: 140,
			},
			{
				accessorKey: 'Instructor',
				header: 'Người hướng dẫn',
				size: 140,
				enableHiding: false,
			},

			{
				accessorKey: 'ThesisName',
				header: 'Tên luận văn',
				size: 140,
				enableHiding: false,
			},
			{
				accessorKey: 'ResearchSubject',
				header: 'Đối tượng nghiên cứu',
				size: 140,
				enableHiding: false,
			},
		],
		[getCommonEditTextFieldProps],
	);

	const columnsExportChemical = useMemo<MRT_ColumnDef<IExportChemicalType>[]>(
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
				accessorKey: 'ChemicalId',
				header: 'Mã hóa chất',
				enableEditing: false,
				size: 140,
			},
			{
				accessorKey: 'ChemicalName',
				header: 'Tên hóa chất',
				enableEditing: false,
				size: 140,
			},
			{
				accessorKey: 'Amount',
				header: 'Số lượng',
				size: 140,
			},
			{
				accessorKey: 'ManufacturerName',
				header: 'Nhà sản xuât',
				enableEditing: false,
				size: 140,
			},
			{
				accessorKey: 'Origin',
				header: 'Xuất xứ',
				enableEditing: false,
				size: 140,
			},
		],
		[getCommonEditTextFieldProps],
	);

	const columnsExportDevice = useMemo<MRT_ColumnDef<IExportDeviceType>[]>(
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

	const handleOpenEditWarehouseRegModal = (row: any) => {
		setUpdatedRow(row.original);
		setIsEditModal(true);
	};

	const onCloseEditWarehouseRegModal = () => {
		setUpdatedRow(dummyWarehouseData);
		setIsEditModal(false);
	};

	const handleSubmitEditWarehouseRegModal = async (updatedRow: any) => {
		const updateData = {
			ExportId: updatedRow.ExportId,
			ExportDate: updatedRow.ExportDate.toString(),
			Content: updatedRow.Content,
			Status: updatedRow.Status,
			EmployeeId: updatedRow.EmployeeId,
			RegisterGeneralId: updatedRow.RegisterGeneralId,
		};

		const resData = await updateWarehouse('reg', updatedRow.ExportId, updateData);

		if (Object.keys(resData).length !== 0) {
			dispatch(setSnackbarMessage('Cập nhật thông tin thành công'));
			let updatedIdx = warehouseRegisterGeneral.findIndex(x => x.ExportId === updatedRow.ExportId);

			let newListOfRegisterGeneral = [
				...warehouseRegisterGeneral.slice(0, updatedIdx),
				updatedRow,
				...warehouseRegisterGeneral.slice(updatedIdx + 1),
			];
			dispatch(setListOfWarehouseRegisterGeneral(newListOfRegisterGeneral));
		} else {
			dispatch(setSnackbarMessage('Cập nhật thông tin không thành công'));
		}
	};

	const handleOpenDeleteWarehouseRegModal = (row: any) => {
		setDeletedRow(row.original);
		setIsDeleteModal(true);
	};

	const onCloseDeleteWarehouseRegModal = () => {
		setDeletedRow(dummyWarehouseData);
		setIsDeleteModal(false);
	};

	const handleSubmitDeleteWarehouseRegModal = async () => {
		try {
			let exportChemicalOfExportChemical = exportChemicalData.filter(
				(x: IExportChemicalType) => x.ExportId === deletedRow.ExportId,
			);
			let exportDeviceOfExportDevice = exportDeviceData.filter(
				(x: IExportDeviceType) => x.ExportId === deletedRow.ExportId,
			);

			let promisesList: any[] = [];

			exportChemicalOfExportChemical.forEach(x => promisesList.push(deleteExportChemical(x.ExportId, x.ChemicalId)));
			exportDeviceOfExportDevice.forEach(async x => promisesList.push(deleteExportDevice(x.ExportId, x.DeviceId)));

			Promise.all(promisesList)
				.then(async () => {
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
				})
				.catch(() => {
					throw new Error();
				});
		} catch (error) {
			dispatch(setSnackbarMessage('Xóa thông tin không thành công'));
		}
	};

	const handleOpenCreateWarehouseRegModal = (row: any) => {
		setIsCreateModal(true);
	};

	const onCloseCreateWarehouseRegModal = () => {
		setIsCreateModal(false);
	};

	const handleSubmitCreateWarehouseRegModal = async (createdRow: any) => {
		try {
			const createData = {
				ExportId: createdRow.ExportId,
				ExportDate: createdRow.ExportDate.toString(),
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
					},
				}}
				columns={columns}
				data={tableData}
				editingMode="modal" //default
				enableColumnOrdering
				enableEditing
				enableRowNumbers
				enablePinning
				enableGrouping
				enableRowActions
				enableExpanding
				initialState={{
					columnVisibility: { RegisterGeneralId: false, EmployeeId: false },
					density: 'compact',
					columnOrder: [
						'mrt-row-expand',
						'mrt-row-numbers',
						...columns.map(x => x.accessorKey || ''),
						'mrt-row-actions',
					],
				}}
				renderDetailPanel={({ row }) => {
					return (
						<>
							<ChemicalTable
								handleOpenCreate={() => {
									setCreatedRow(row.original);
									setIsCreateExportChemicalModal(true);
								}}
								handleOpenDelete={(exportChemical: any) => {
									setDeletedRow(exportChemical);
									setIsDeleteExportChemicalModal(true);
								}}
								handleOpenEdit={(exportChemical: any) => {
									setUpdatedRow(exportChemical);
									setIsEditExportChemicalModal(true);
								}}
								row={row}
							/>
							<DeviceTable 
								handleOpenCreate={() => {
									setCreatedRow(row.original);
									setIsCreateExportDeviceModal(true);
								}}
								handleOpenDelete={(exportDevice: any) => {
									setUpdatedRow(exportDevice);
									setIsEditExportDeviceModal(true);
								}}
								handleOpenEdit={(exportDevice: any) => {
									setDeletedRow(exportDevice);
									setIsDeleteExportDeviceModal(true);
								}}
								row={row}
							/>
						</>
					);
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
					<>
						<Tooltip arrow placement="left" title="Sửa thông tin phiếu xuất đăng kí chung">
							<IconButton onClick={() => handleOpenEditWarehouseRegModal(row)}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip arrow placement="right" title="Xoá thông tin phiếu xuất đăng kí chung">
							<IconButton color="error" onClick={() => handleOpenDeleteWarehouseRegModal(row)}>
								<Delete />
							</IconButton>
						</Tooltip>
					</>
				)}
				renderBottomToolbarCustomActions={() => (
					<Tooltip title="Tạo phiếu xuất đăng kí chung mới" placement="right-start">
						<Button
							color="primary"
							onClick={handleOpenCreateWarehouseRegModal}
							variant="contained"
							style={{ margin: '10px' }}
						>
							<AddIcon fontSize="small" />
						</Button>
					</Tooltip>
				)}
			/>

			{isDeleteModal && (
				<DeleteExportModal
					isOpen={isDeleteModal}
					onClose={onCloseDeleteWarehouseRegModal}
					title="Xoá thông tin phiếu xuất đăng kí chung"
					handleSubmit={handleSubmitDeleteWarehouseRegModal}
				>
					Bạn có chắc muốn xoá thông tin{' '}
					<Typography component="span" color="red">
						{deletedRow.ExportId} - {deletedRow.Content} - {deletedRow.EmployeeName}
					</Typography>{' '}
					không?
				</DeleteExportModal>
			)}

			{isCreateModal && (
				<CreateExportModal
					onClose={onCloseCreateWarehouseRegModal}
					columns={columns}
					isCreateModal={isCreateModal}
					handleSubmitCreateModal={handleSubmitCreateWarehouseRegModal}
				/>
			)}
			{isEditModal && (
				<EditExportModal
					initData={updatedRow}
					isEditModal={isEditModal}
					columns={columns}
					onClose={onCloseEditWarehouseRegModal}
					handleSubmitEditModal={handleSubmitEditWarehouseRegModal}
				/>
			)}

			{isDeleteExportChemicalModal && (
				<DeleteExportChemicalModal
					isOpen={isDeleteExportChemicalModal}
					initData={deletedRow}
					onClose={() => setIsDeleteExportChemicalModal(false)}
				/>
			)}

			{isCreateExportChemicalModal && (
				<CreateExportChemicalModal
					initData={createdRow}
					isOpen={isCreateExportChemicalModal}
					columns={columnsExportChemical}
					onClose={() => setIsCreateExportChemicalModal(false)}
				/>
			)}

			{isEditExportChemicalModal && (
				<EditExportChemicalModal
					initData={updatedRow}
					isOpen={isEditExportChemicalModal}
					columns={columnsExportChemical}
					onClose={() => setIsEditExportChemicalModal(false)}
				/>
			)}

			{isCreateExportDeviceModal && (
				<CreateExportDeviceModal
					initData={createdRow}
					isOpen={isCreateExportDeviceModal}
					columns={columnsExportDevice}
					onClose={() => setIsCreateExportDeviceModal(false)}
				/>
			)}

			{isDeleteExportDeviceModal && (
				<DeleteExportDeviceModal
					isOpen={isDeleteExportDeviceModal}
					initData={deletedRow}
					onClose={() => setIsDeleteExportDeviceModal(false)}
				/>
			)}

			{isEditExportDeviceModal && (
				<EditExportDeviceModal
					initData={updatedRow}
					isOpen={isEditExportDeviceModal}
					columns={columnsExportDevice}
					onClose={() => setIsEditExportDeviceModal(false)}
				/>
			)}
		</>
	);
};

export default RegisterGeneralTabItem;
