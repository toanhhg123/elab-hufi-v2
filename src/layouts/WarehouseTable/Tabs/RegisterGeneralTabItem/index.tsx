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
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { setSnackbarMessage } from '../../../../pages/appSlice';
import {
	deleteExportRegs,
	getExportsRegById,
	postExportRegs,
	updateExportRegs,
} from '../../../../services/exportsServices';
import { RootState } from '../../../../store';
import { IExportChemicalType } from '../../../../types/exportChemicalType';
import { dummyExportData, IExportType } from '../../../../types/exportType';
import ChemicalTable, { ColumnType } from '../../Details/ChemicalTable';
import CreateExportChemicalModal from '../../Modal/CreateExportChemicalModal';
import CreateExportModal from '../../Modal/CreateExportModal';
import DeleteExportModal from '../../Modal/DeleteExportModal';
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
	const registerGeneralsData = useAppSelector((state: RootState) => state.registerGeneral.listOfRegisterGeneral);

	const [isCreateExportChemicalModal, setIsCreateExportChemicalModal] = useState<boolean>(false);
	const [isCreateModal, setIsCreateModal] = useState<boolean>(false);
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
	const [tableData, setTableData] = useState<IExportType[]>([]);
	const [validationErrors, setValidationErrors] = useState<{
		[cellId: string]: string;
	}>({});

	const dispatch = useAppDispatch();

	const [createdRow, setCreatedRow] = useState<any>(dummyExportData);
	const [updatedRow, setUpdatedRow] = useState<any>(dummyExportData);
	const [deletedRow, setDeletedRow] = useState<any>(dummyExportData);

	useEffect(() => {
		let formatedData = warehouseRegisterGeneral.map((x: IExportType) => {
			let employeeInfoIdx = Array.isArray(employeeData)
				? employeeData.findIndex(y => y.EmployeeID === x.EmployeeId)
				: -1;

			return {
				...x,
				EmployeeName: employeeInfoIdx > -1 ? employeeData[employeeInfoIdx].Fullname : '',
				formatedExportDate: moment.unix(x.ExportDate).format('DD/MM/YYYY'),
			};
		});
		formatedData.sort((x, y) => y.ExportDate - x.ExportDate);
		setTableData(formatedData);
	}, [warehouseRegisterGeneral]);

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
				accessorKey: 'ExpRegGeneralId',
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
				accessorKey: 'EmployeeName',
				header: 'Người xuất',
				size: 140,
				enableHiding: false,
			},
			{
				accessorKey: 'EmployeeId',
				header: 'Người xuất',
				size: 140,
			},
			{
				accessorKey: 'RegisterGeneralId',
				header: 'RegisterGeneralId',
				size: 140,
			},
			{
				accessorKey: 'Schoolyear',
				header: 'Năm học',
				size: 140,
			},
			{
				accessorKey: 'Semester',
				header: 'Học kỳ',
				size: 140,
			},
		],
		[getCommonEditTextFieldProps],
	);

	const columnsReg = useRef([
		{ id: 'RegisterGeneralId', header: 'Mã đăng kí chung' },
		{ id: 'DateCreate', header: 'Ngày tạo' },
		{ id: 'Instructor', header: 'Người hướng dẫn' },
		{ id: 'ThesisName', header: 'Tên luận văn' },
		{ id: 'ResearchSubject', header: 'Đối tượng nghiên cứu' },
		{ id: 'StartDate', header: 'Ngày bắt đầu' },
		{ id: 'EndDate', header: 'Ngày kết thúc' },
		{ id: 'Status', header: 'Trạng thái' },
	]);

	const columnsChemicalTable = useRef<ColumnType[]>([
		{
			id: 'ExpChemDeptId',
			header: 'Mã xuất hoá chất',
		},
		{
			id: 'ChemicalName',
			header: 'Tên hoá chất',
		},
		{
			id: 'Amount',
			header: 'Số lượng',
			renderValue: (amount, unit) => `${amount} (${unit})`,
		},
	]);

	const columnsExportChemicalModal = useMemo<MRT_ColumnDef<IExportChemicalType>[]>(
		() => [
			{
				accessorKey: 'ExpRegGeneralId',
				header: 'ID',
				size: 100,
				enableColumnOrdering: true,
				enableEditing: false,
				enableSorting: false,
			},
			{
				accessorKey: 'ExpChemDeptId',
				header: 'Mã xuất hoá chất',
				size: 140,
			},
			{
				accessorKey: 'ChemicalName',
				header: 'Mã hóa chất',
				enableEditing: false,
				size: 140,
			},
			{
				accessorKey: 'Amount',
				header: 'Tên hóa chất',
				enableEditing: false,
				size: 140,
			},
			{
				accessorKey: 'Unit',
				header: 'Số lượng',
				size: 140,
			},
			{
				accessorKey: 'ChemDetailId',
				header: 'Nhà sản xuât',
				enableEditing: false,
				size: 140,
			},
			// 		{
			// 			accessorKey: 'Origin',
			// 			header: 'Xuất xứ',
			// 			enableEditing: false,
			// 			size: 140,
			// 		},
		],
		[getCommonEditTextFieldProps],
	);

	const handleOpenEditWarehouseRegModal = (row: any) => {
		setUpdatedRow(row.original);
		setIsEditModal(true);
	};

	const onCloseEditWarehouseRegModal = () => {
		setUpdatedRow(dummyExportData);
		setIsEditModal(false);
	};

	const handleOpenDeleteWarehouseRegModal = (row: any) => {
		setDeletedRow(row.original);
		setIsDeleteModal(true);
	};

	const onCloseDeleteWarehouseRegModal = () => {
		setDeletedRow(dummyExportData);
		setIsDeleteModal(false);
	};

	const handleOpenCreateWarehouseRegModal = (row: any) => {
		setIsCreateModal(true);
	};

	const onCloseCreateWarehouseRegModal = () => {
		setIsCreateModal(false);
	};

	const handleSubmitEditWarehouseRegModal = async (updatedRow: any) => {
		const updateData = {
			ExpRegGeneralId: updatedRow.ExpRegGeneralId,
			ExportDate: Number(updatedRow.ExportDate),
			Content: updatedRow.Content,
			Semester: Number(updatedRow.Semester),
			Schoolyear: updatedRow.Schoolyear,
			EmployeeId: updatedRow.EmployeeId,
			RegisterGeneralId: updatedRow.RegisterGeneralId,
			listChemicalExport: updatedRow.listChemicalExport,
		};

		setCreatedRow(updateData);
		setIsCreateExportChemicalModal(true);
	};

	const handleSubmitDeleteWarehouseRegModal = async () => {
		try {
			const resData = await deleteExportRegs(deletedRow.ExpRegGeneralId);
			if (resData) {
				dispatch(setSnackbarMessage('Xóa thông tin thành công'));
				let deletedIdx = warehouseRegisterGeneral.findIndex(
					x => x.ExpRegGeneralId === deletedRow.ExpRegGeneralId,
				);
				let newListOfReg = [
					...warehouseRegisterGeneral.slice(0, deletedIdx),
					...warehouseRegisterGeneral.slice(deletedIdx + 1),
				];
				dispatch(setListOfWarehouseRegisterGeneral(newListOfReg));
			} else {
				dispatch(setSnackbarMessage('Xóa thông tin không thành công'));
			}
		} catch (error) {
			dispatch(setSnackbarMessage('Xóa thông tin không thành công'));
		}
	};

	const handleSubmitCreateWarehouseRegModal = async (createdRow: any) => {
		try {
			const createData = {
				ExpRegGeneralId: createdRow.ExpRegGeneralId,
				ExportDate: Number(createdRow.ExportDate),
				Content: createdRow.Content,
				Semester: Number(createdRow.Semester),
				Schoolyear: createdRow.Schoolyear,
				EmployeeId: createdRow.EmployeeId,
				RegisterGeneralId: createdRow.RegisterGeneralId,
				listChemicalExport: createdRow.listChemicalExport,
			};

			setCreatedRow(createData);
			setIsCreateExportChemicalModal(true);
		} catch (error) {
			dispatch(setSnackbarMessage('Tạo thông tin mới không thành công'));
		}
	};

	const handleSumbitCreateExportChemical = async (listChemical: any, row: any) => {
		const listChemicalExportUpdate = listChemical.map((chemical: any) => ({
			ExpChemDeptId: chemical.ExpChemDeptId,
			ChemicalName: chemical.ChemicalName,
			Amount: chemical.Amount,
			Unit: chemical.Unit,
		}));

		const createData: IExportType = {
			...createdRow,
			listChemicalExport: listChemicalExportUpdate,
		};

		const isExist: boolean =
			warehouseRegisterGeneral.findIndex(x => x.ExpRegGeneralId === createData.ExpRegGeneralId) > -1;

		if (isExist) {
			const resData = await updateExportRegs(createData);

			if (Object.keys(resData).length !== 0) {
				dispatch(setSnackbarMessage('Cập nhật thông tin thành công'));
				let updatedIdx = warehouseRegisterGeneral.findIndex(x => x.ExpRegGeneralId === row.ExpRegGeneralId);
				let newListOfRegs = [
					...warehouseRegisterGeneral.slice(0, updatedIdx),
					createData,
					...warehouseRegisterGeneral.slice(updatedIdx + 1),
				];
				dispatch(setListOfWarehouseRegisterGeneral(newListOfRegs));
			} else {
				dispatch(setSnackbarMessage('Cập nhật thông tin không thành công'));
			}
		} else {
			const resData = await postExportRegs(createData);
			if (Object.keys(resData).length !== 0) {
				const newListOfRegs: IExportType = await getExportsRegById(createData?.ExpRegGeneralId || '');
				if (newListOfRegs) {
					dispatch(setSnackbarMessage('Tạo thông tin mới thành công'));
					dispatch(setListOfWarehouseRegisterGeneral([...warehouseRegisterGeneral, newListOfRegs]));
				}
			} else {
				dispatch(setSnackbarMessage('Tạo thông tin mới không thành công'));
			}
		}

		setIsCreateExportChemicalModal(false);
		setIsCreateModal(false);
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
				muiTableDetailPanelProps={{
					sx: { background: '#f3f3f3' },
				}}
				renderDetailPanel={({ row }) => {
					let registerGeneralInfoIdx = registerGeneralsData.findIndex(
						y => y.RegisterGeneralId === row.original.RegisterGeneralId,
					);
					return (
						<>
							<TableContainer component={Paper} sx={{ marginBottom: '24px' }}>
								<Table sx={{ minWidth: 650 }} aria-label="simple table">
									<TableHead>
										<TableRow>
											{columnsReg.current.map(col => {
												return (
													<StyledTableCell key={col.id} align="left">
														<b>{col.header}</b>
													</StyledTableCell>
												);
											})}
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
											{columnsReg.current.map(col => {
												const data = registerGeneralsData[registerGeneralInfoIdx];
												return (
													<TableCell key={col.id} align="left">
														{data[col.id as keyof typeof data]
															? `${data[col.id as keyof typeof data]}`
															: ''}
													</TableCell>
												);
											})}
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
							<ChemicalTable
								columns={columnsChemicalTable.current}
								warehouseData={warehouseRegisterGeneral}
								row={row}
								type="REG"
							/>
							{/* <ChemicalTable
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
							/> */}
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
						{deletedRow.ExpRegGeneralId} - {deletedRow.Content} - {deletedRow.EmployeeName}
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

			{/* {isDeleteExportChemicalModal && (
				<DeleteExportChemicalModal
					isOpen={isDeleteExportChemicalModal}
					initData={deletedRow}
					onClose={() => setIsDeleteExportChemicalModal(false)}
				/>
			)} */}

			{isCreateExportChemicalModal && (
				<CreateExportChemicalModal
					type="REG"
					initData={createdRow}
					isOpen={isCreateExportChemicalModal}
					columns={columnsExportChemicalModal}
					onClose={() => setIsCreateExportChemicalModal(false)}
					handleSubmit={handleSumbitCreateExportChemical}
				/>
			)}

			{/* {isEditExportChemicalModal && (
				<EditExportChemicalModal
					initData={updatedRow}
					isOpen={isEditExportChemicalModal}
					columns={columnsExportChemicalModal}
					onClose={() => setIsEditExportChemicalModal(false)}
				/>
			)} */}

			{/* {isCreateExportDeviceModal && (
				<CreateExportDeviceModal
					initData={createdRow}
					isOpen={isCreateExportDeviceModal}
					columns={columnsExportDeviceModal}
					onClose={() => setIsCreateExportDeviceModal(false)}
				/>
			)} */}

			{/* {isDeleteExportDeviceModal && (
				<DeleteExportDeviceModal
					isOpen={isDeleteExportDeviceModal}
					initData={deletedRow}
					onClose={() => setIsDeleteExportDeviceModal(false)}
				/>
			)} */}

			{/* {isEditExportDeviceModal && (
				<EditExportDeviceModal
					initData={updatedRow}
					isOpen={isEditExportDeviceModal}
					columns={columnsExportDeviceModal}
					onClose={() => setIsEditExportDeviceModal(false)}
				/>
			)} */}
		</>
	);
	return <></>;
};

export default RegisterGeneralTabItem;
