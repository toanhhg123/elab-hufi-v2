import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { setSnackbarMessage } from '../../../../pages/appSlice';
import { deleteExportLabs, getExportsLabById, getExportsLabs, postExportLabs, updateExportLabs } from '../../../../services/exportsServices';
import { RootState } from '../../../../store';
import { IExportDeviceType } from '../../../../types/exportDeviceType';
import { dummyExportData, IExportType } from '../../../../types/exportType';
import DeviceTable, { ColumnType } from '../../Details/DeviceTable';
import InstrumentTable from '../../Details/Instrument';
import CreateExportDeviceModal from '../../Modal/CreateExportDeviceModal';
import CreateExportModal from '../../Modal/CreateExportModal';
import DeleteExportModal from '../../Modal/DeleteExportModal';
import EditExportModal from '../../Modal/EditExportModal';
import { setListOfWarehouseLaboratory } from '../../warehouseSlice';

const LaboratoryTabItem: FC = () => {
	const warehouseLaboratoriesData = useAppSelector((state: RootState) => state.warehouse.listOfWarehouseLaboratory);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
	const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);
	const dispatch = useAppDispatch();

	const [isCreateExportInstrumentModal, setIsCreateExportInstrumentModal] = useState<boolean>(false);
	const [isCreateExportDeviceModal, setIsCreateExportDeviceModal] = useState<boolean>(false);
	const [isCreateModal, setIsCreateModal] = useState<boolean>(false);
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
	const [tableData, setTableData] = useState<IExportType[]>([]);
	const [validationErrors, setValidationErrors] = useState<{
		[cellId: string]: string;
	}>({});

	const [createdRow, setCreatedRow] = useState<any>(dummyExportData);
	const [updatedRow, setUpdatedRow] = useState<any>(dummyExportData);
	const [deletedRow, setDeletedRow] = useState<any>(dummyExportData);

	useEffect(() => {
		let formatedData = warehouseLaboratoriesData.map((x: IExportType) => {
			let employeeInfoIdx = Array.isArray(employeeData)
				? employeeData.findIndex(y => y.EmployeeID === x.EmployeeId)
				: -1;
			let laboratoryInfoIdx = Array.isArray(laboratoriesData)
				? laboratoriesData.findIndex(y => y.LabId === x.LabId)
				: -1;
			let departmentInfoIdx = Array.isArray(departmentData)
				? departmentData.findIndex(y => y.DepartmentId === x.DepartmentId)
				: -1;
			return {
				...x,
				EmployeeName: employeeInfoIdx > -1 ? employeeData[employeeInfoIdx].Fullname : '',
				LabName: laboratoryInfoIdx > -1 ? laboratoriesData[laboratoryInfoIdx].LabName : '',
				DepartmentName: departmentInfoIdx > -1 ? departmentData[departmentInfoIdx].DepartmentName : '',
				formatedExportDate: moment.unix(x.ExportDate).format('DD/MM/YYYY'),
			};
		});
		formatedData.sort((x, y) => y.ExportDate - x.ExportDate);
		setTableData(formatedData);
	}, [warehouseLaboratoriesData]);

	const getCommonEditTextFieldProps = useCallback(
		(cell: MRT_Cell<IExportType>): MRT_ColumnDef<IExportType>['muiTableBodyCellEditTextFieldProps'] => {
			return {
				error: !!validationErrors[cell.id],
				helperText: validationErrors[cell.id],
			};
		},
		[validationErrors],
	);

	const columns = useMemo<MRT_ColumnDef<IExportType>[]>(
		() => [
			{
				accessorKey: 'ExportLabId',
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
				accessorKey: 'EmployeeId',
				header: 'Người xuất',
				size: 140,
			},
			{
				accessorKey: 'EmployeeName',
				header: 'Người xuất',
				size: 140,
				enableHiding: false,
			},
			{
				accessorKey: 'LabName',
				header: 'Phòng',
				size: 140,
				enableHiding: false,
			},
			{
				accessorKey: 'LabId',
				header: 'LabId',
				size: 140,
			},
			{
				accessorKey: 'DepartmentName',
				header: 'Khoa',
				size: 140,
				enableHiding: false,
			},
			{
				accessorKey: 'DepartmentId',
				header: 'Khoa',
				size: 140,
			},
		],
		[getCommonEditTextFieldProps],
	);

	const columnsExportDevice = useMemo<MRT_ColumnDef<IExportDeviceType>[]>(
		() => [
			{
				accessorKey: 'ExportLabId',
				header: 'ID',
				size: 100,
				enableColumnOrdering: true,
				enableEditing: false,
				enableSorting: false,
			},
			{
				accessorKey: 'ExpDeviceDeptId',
				header: 'Mã xuất Thiết bị',
				size: 100,
			},
			{
				accessorKey: 'DeviceName',
				header: 'Mã Thiết bị',
				enableEditing: false,
				size: 140,
			},
			{
				accessorKey: 'SerialNumber',
				header: 'Tên thiết bị',
				size: 140,
			},
			{
				accessorKey: 'Quantity',
				header: 'Số lượng',
				size: 140,
			},
			{
				accessorKey: 'ManufacturingDate',
				header: 'Xuất xứ',
				size: 140,
			},
			{
				accessorKey: 'StartGuarantee',
				header: 'Mẫu',
				size: 140,
			},
			{
				accessorKey: 'EndGuarantee',
				header: 'Mẫu',
				size: 140,
			},
			{
				accessorKey: 'YearStartUsage',
				header: 'Mẫu',
				size: 140,
			},
			{
				accessorKey: 'HoursUsage',
				header: 'Mẫu',
				size: 140,
			},
		],
		[getCommonEditTextFieldProps],
	);

	const columnsExportInstrument = useMemo<MRT_ColumnDef<IExportDeviceType>[]>(
		() => [
			{
				accessorKey: 'ExportLabId',
				header: 'ID',
				size: 100,
				enableColumnOrdering: true,
				enableEditing: false,
				enableSorting: false,
			},
			{
				accessorKey: 'ExpDeviceDeptId',
				header: 'Mã xuất Thiết bị',
				size: 100,
			},
			{
				accessorKey: 'DeviceName',
				header: 'Mã Thiết bị',
				enableEditing: false,
				size: 140,
			},
			{
				accessorKey: 'SerialNumber',
				header: 'Tên thiết bị',
				size: 140,
			},
			{
				accessorKey: 'Quantity',
				header: 'Số lượng',
				size: 140,
			},
			{
				accessorKey: 'ManufacturingDate',
				header: 'Xuất xứ',
				size: 140,
			},
			{
				accessorKey: 'StartGuarantee',
				header: 'Mẫu',
				size: 140,
			},
			{
				accessorKey: 'EndGuarantee',
				header: 'Mẫu',
				size: 140,
			},
			{
				accessorKey: 'YearStartUsage',
				header: 'Mẫu',
				size: 140,
			},
			{
				accessorKey: 'HoursUsage',
				header: 'Mẫu',
				size: 140,
			},
		],
		[getCommonEditTextFieldProps],
	);

	const columsDeviceTable = useRef([
		{ id: 'ExpDeviceDeptId', header: 'ID' },
		{ id: 'DeviceName', header: 'Tên thiết bị' },
		{ id: 'SerialNumber', header: 'Số Serial' },
		{ id: 'Unit', header: 'Đơn vị' },
		{ id: 'ManufacturingDate', header: 'Ngày sản xuất', type: 'date' },
		{ id: 'StartGuarantee', header: 'Bắt đầu bảo hành', type: 'date' },
		{ id: 'EndGuarantee', header: 'Kết thúc bảo hành', type: 'date' },
		{ id: 'YearStartUsage', header: 'Năm bắt đầu sử dụng' },
		{ id: 'HoursUsage', header: 'Giờ sử dụng' },
	]);

	const columnsInstrumentTable = useRef<ColumnType[]>([
		{
			id: 'ExpDeviceDeptId',
			header: 'Mã xuất thiết bị',
		},
		{
			id: 'DeviceName',
			header: 'Tên thiết bị',
		},
		{
			id: 'Quantity',
			header: 'Số lượng',
			renderValue: (amount, unit) => `${amount} (${unit})`,
		},
	]);

	const handleOpenEditWarehouseLabModal = (row: any) => {
		setUpdatedRow(row.original);
		setIsEditModal(true);
	};

	const onCloseEditWarehouseLab = () => {
		setUpdatedRow(dummyExportData);
		setIsEditModal(false);
	};

	const handleOpenDeleteWarehouseLabModal = (row: any) => {
		setDeletedRow(row.original);
		setIsDeleteModal(true);
	};

	const onCloseDeleteWarehouseLabModal = () => {
		setDeletedRow(dummyExportData);
		setIsDeleteModal(false);
	};

	const handleOpenCreateWarehouseLabModal = (row: any) => {
		setIsCreateModal(true);
	};

	const onCloseCreateWarehouseLabModal = () => {
		setIsCreateModal(false);
	};

	const handleSubmitDeleteWarehouseLabModal = async () => {
		try {
			const data = await deleteExportLabs(deletedRow.ExportLabId);
			if (data) {
				dispatch(setSnackbarMessage('Xóa thông tin thành công'));
				let deletedIdx = warehouseLaboratoriesData.findIndex(x => x.ExportLabId === deletedRow.ExportLabId);
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
	};

	const handleSubmitEditWarehouseLabModal = async (updatedRow: any) => {
		try {
			const updateData = {
				ExportLabId: updatedRow.ExportLabId,
				ExportDate: Number(updatedRow.ExportDate),
				Content: updatedRow.Content,
				EmployeeId: updatedRow.EmployeeId,
				DepartmentId: updatedRow.DepartmentId,
				LabId: updatedRow.LabId,
				listDevice: updatedRow.listDevice,
				listInstrument: updatedRow.listInstrument,
			};

			setCreatedRow(updateData);
			setIsCreateExportDeviceModal(true);
		} catch (error) {
			dispatch(setSnackbarMessage('Cập nhật thông tin không thành công'));
		}
	};

	const handleSubmitCreateWarehouseLabModal = async (createdRow: any) => {
		try {
			const createData = {
				ExportLabId: createdRow.ExportLabId,
				ExportDate: Number(createdRow.ExportDate),
				Content: createdRow.Content,
				EmployeeId: createdRow.EmployeeId,
				DepartmentId: createdRow.DepartmentId,
				LabId: createdRow.LabId,
				listDevice: createdRow.listDevice,
				listInstrument: createdRow.listInstrument,
			};

			setCreatedRow(createData);
			setIsCreateExportDeviceModal(true);
		} catch (error) {
			dispatch(setSnackbarMessage('Tạo thông tin mới không thành công'));
		}
	};

	const handleSubmitCreateDeviceModal = (listDevice: any, row: any) => {
		const listDeviceExportUpdate = listDevice?.map((device: any) => ({
			ExpDeviceDeptId: device.ExpDeviceDeptId,
			DeviceName: device.DeviceName,
			Unit: device.Unit,
			SerialNumber: device.SerialNumber,
			ManufacturingDate: device.ManufacturingDate,
			StartGuarantee: device.StartGuarantee,
			EndGuarantee: device.EndGuarantee,
			YearStartUsage: device.YearStartUsage,
			HoursUsage: device.HoursUsage,
		}));

		const createData: IExportType = {
			...createdRow,
			listDevice: listDeviceExportUpdate,
		};
		setCreatedRow(createData);
		setIsCreateExportDeviceModal(false);
		setIsCreateExportInstrumentModal(true);
	};

	const handleSubmitCreateInstrumentModal = async (listDevice: any, row: any) => {
		const listDeviceExportUpdate = listDevice?.map((device: any) => ({
			ExpDeviceDeptId: device.ExpDeviceDeptId,
			DeviceName: device.DeviceName,
			Unit: device.Unit,
			Quantity: device.Amount,
		}));

		const createData: IExportType = {
			...createdRow,
			listInstrument: listDeviceExportUpdate,
		};

		const isExist: boolean = warehouseLaboratoriesData.findIndex(x => x.ExportLabId === createData.ExportLabId) > -1;
		if (isExist) {
			const resData = await updateExportLabs(createData);

			if (Object.keys(resData).length !== 0) {
				dispatch(setSnackbarMessage('Cập nhật thông tin thành công'));
				let updatedIdx = warehouseLaboratoriesData.findIndex(x => x.ExportLabId === createData.ExportLabId);
				let newListOfLab = [
					...warehouseLaboratoriesData.slice(0, updatedIdx),
					createData,
					...warehouseLaboratoriesData.slice(updatedIdx + 1),
				];
				dispatch(setListOfWarehouseLaboratory(newListOfLab));
			} else {
				dispatch(setSnackbarMessage('Cập nhật thông tin không thành công'));
			}
		} else {
			const resData = await postExportLabs(createData);
			if (Object.keys(resData).length !== 0) {
				const newListOfLabs: IExportType = await getExportsLabById(createData?.ExportLabId || '');
				if (newListOfLabs) {
					dispatch(setSnackbarMessage('Tạo thông tin mới thành công'));
					dispatch(setListOfWarehouseLaboratory([...warehouseLaboratoriesData, newListOfLabs]));
				}
			} else {
				dispatch(setSnackbarMessage('Tạo thông tin mới không thành công'));
			}
		}

		console.log(createData);
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
				muiTableDetailPanelProps={{
					sx: { background: '#f3f3f3' },
				}}
				initialState={{
					density: 'compact',
					columnVisibility: { LabId: false, EmployeeId: false, DepartmentId: false },
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
							<DeviceTable
								warehouseData={warehouseLaboratoriesData}
								columns={columsDeviceTable.current}
								type="LAB"
								row={row}
							/>
							<InstrumentTable
								warehouseData={warehouseLaboratoriesData}
								columns={columnsInstrumentTable.current}
								type="LAB"
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
						<span>Quản lý phiếu xuất phòng thí nghiệm</span>
					</h3>
				)}
				renderRowActions={({ row, table }) => (
					<>
						<Tooltip arrow placement="left" title="Sửa thông tin phiếu xuất phòng thí nghiệm">
							<IconButton onClick={() => handleOpenEditWarehouseLabModal(row)}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip arrow placement="right" title="Xoá phiếu xuất phòng thí nghiệm">
							<IconButton color="error" onClick={() => handleOpenDeleteWarehouseLabModal(row)}>
								<Delete />
							</IconButton>
						</Tooltip>
					</>
				)}
				renderBottomToolbarCustomActions={() => (
					<Tooltip title="Tạo phiếu xuất phòng thí nghiệm mới" placement="right-start">
						<Button
							color="primary"
							onClick={handleOpenCreateWarehouseLabModal}
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
					onClose={onCloseDeleteWarehouseLabModal}
					title="Xoá thông tin phiếu xuất phòng thí nghiệm"
					handleSubmit={handleSubmitDeleteWarehouseLabModal}
				>
					Bạn có chắc muốn xoá thông tin{' '}
					<Typography component="span" color="red">
						{deletedRow.ExportLabId} - {deletedRow.Content} - {deletedRow.EmployeeName}
					</Typography>{' '}
					không?
				</DeleteExportModal>
			)}

			{isCreateModal && (
				<CreateExportModal
					onClose={onCloseCreateWarehouseLabModal}
					columns={columns}
					isCreateModal={isCreateModal}
					handleSubmitCreateModal={handleSubmitCreateWarehouseLabModal}
				/>
			)}

			{isEditModal && (
				<EditExportModal
					initData={updatedRow}
					isEditModal={isEditModal}
					columns={columns}
					onClose={onCloseEditWarehouseLab}
					handleSubmitEditModal={handleSubmitEditWarehouseLabModal}
				/>
			)}

			{/* <CreateExportDeviceModal
				isOpen={isCreateExportDeviceModal}
				onClose={() => setIsCreateExportDeviceModal(false)}
			/> */}

			{/* {isDeleteExportChemicalModal && (
				<DeleteExportChemicalModal
					isOpen={isDeleteExportChemicalModal}
					initData={deletedRow}
					onClose={() => setIsDeleteExportChemicalModal(false)}
				/>
			)} */}

			{/* {isCreateExportChemicalModal && (
				<CreateExportChemicalModal
					initData={createdRow}
					isOpen={isCreateExportChemicalModal}
					columns={columnsExportChemical}
					onClose={() => setIsCreateExportChemicalModal(false)}
				/>
			)} */}

			{/* {isEditExportChemicalModal && (
				<EditExportChemicalModal
					initData={updatedRow}
					isOpen={isEditExportChemicalModal}
					columns={columnsExportChemical}
					onClose={() => setIsEditExportChemicalModal(false)}
				/>
			)} */}

			{/* {isDeleteExportDeviceModal && (
				<DeleteExportDeviceModal
					isOpen={isDeleteExportDeviceModal}
					initData={deletedRow}
					onClose={() => setIsDeleteExportDeviceModal(false)}
				/>
			)} */}

			{isCreateExportDeviceModal && (
				<CreateExportDeviceModal
					type="LAB_DEV"
					handleSubmit={handleSubmitCreateDeviceModal}
					initData={createdRow}
					isOpen={isCreateExportDeviceModal}
					columns={columnsExportDevice}
					onClose={() => setIsCreateExportDeviceModal(false)}
				/>
			)}

			{isCreateExportInstrumentModal && (
				<CreateExportDeviceModal
					type="LAB_INS"
					handleSubmit={handleSubmitCreateInstrumentModal}
					initData={createdRow}
					isOpen={isCreateExportInstrumentModal}
					columns={columnsExportDevice}
					onClose={() => setIsCreateExportInstrumentModal(false)}
				/>
			)}

			{/* {isEditExportDeviceModal && (
				<EditExportDeviceModal
					initData={updatedRow}
					isOpen={isEditExportDeviceModal}
					columns={columnsExportDevice}
					onClose={() => setIsEditExportDeviceModal(false)}
				/>
			)} */}
		</>
	);
};

export default LaboratoryTabItem;
