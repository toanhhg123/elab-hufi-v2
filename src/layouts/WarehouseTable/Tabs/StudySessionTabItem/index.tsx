import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { setSnackbarMessage } from '../../../../pages/appSlice';
import {
	deleteExportSubs,
	getExportsSubById,
	postExportSubs,
	updateExportSubs,
} from '../../../../services/exportsServices';
import { RootState } from '../../../../store';
import { IExportChemicalType } from '../../../../types/exportChemicalType';
import { dummyExportData, IExportType } from '../../../../types/exportType';
import ChemicalTable, { ColumnType } from '../../Details/ChemicalTable';
import CreateExportChemicalModal from '../../Modal/CreateExportChemicalModal';
import CreateExportModal from '../../Modal/CreateExportModal';
import DeleteExportModal from '../../Modal/DeleteExportModal';
import EditExportModal from '../../Modal/EditExportModal';
import { setListOfWarehouseStudySession } from '../../warehouseSlice';

const StudySessionTabItem: FC = () => {
	const warehouseStudySession = useAppSelector((state: RootState) => state.warehouse.listOfWarehouseStudySession);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const subjectData = useAppSelector((state: RootState) => state.subject.listOfSubjects);
	const studySessionData = useAppSelector((state: RootState) => state.schedule.listOfSchedules);

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
		let formatedData = warehouseStudySession.map((x: IExportType) => {
			let employeeInChargeInfoIdx = Array.isArray(employeeData)
				? employeeData.findIndex(y => y.EmployeeID === x.EmployeeInCharge)
				: -1;
			let employeeCreateInfoIdx = Array.isArray(employeeData)
				? employeeData.findIndex(y => y.EmployeeID === x.EmployeeCreate)
				: -1;
			let subjectInfoIdx = Array.isArray(subjectData)
				? subjectData?.findIndex(y => y.SubjectId === x.SubjectId)
				: -1;

			return {
				...x,
				formatedExportDate: moment.unix(x.ExportDate).format('DD/MM/YYYY'),
				EmployeeInChargeName:
					employeeInChargeInfoIdx > -1 ? employeeData[employeeInChargeInfoIdx].Fullname : '',
				EmployeeCreateName: employeeCreateInfoIdx > -1 ? employeeData[employeeCreateInfoIdx].Fullname : '',
				SubjectName: subjectInfoIdx > -1 ? subjectData[subjectInfoIdx].SubjectName : '',
			};
		});
		formatedData.sort((x, y) => y.ExportDate - x.ExportDate);
		setTableData(formatedData);
	}, [warehouseStudySession, studySessionData]);

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
				accessorKey: 'ExpSubjectId',
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
				accessorKey: 'Schoolyear',
				header: 'Năm học',
				size: 140,
			},
			{
				accessorKey: 'Semester',
				header: 'Học kỳ',
				size: 140,
			},
			{
				accessorKey: 'SubjectId',
				header: 'Môn học',
				size: 140,
			},
			{
				accessorKey: 'EmployeeInCharge',
				header: 'Người phụ trách',
				size: 140,
			},
			{
				accessorKey: 'EmployeeCreate',
				header: 'Người tạo',
				size: 140,
			},
		],
		[getCommonEditTextFieldProps],
	);

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
				accessorKey: 'ExpSubjectId',
				header: 'ID',
				size: 100,
				enableColumnOrdering: true,
				enableEditing: false,
				enableSorting: false,
			},
			{
				accessorKey: 'ExpChemDeptId',
				header: 'Mã xuất hoá chất',
				enableEditing: false,
				size: 140,
			},
			{
				accessorKey: 'ChemicalName',
				header: 'Tên hoá chất',
				size: 140,
			},
			{
				accessorKey: 'Amount',
				header: 'Số lượng',
				size: 140,
			},
			{
				accessorKey: 'Unit',
				header: 'Đơn vị',
				size: 140,
			},
		],
		[getCommonEditTextFieldProps],
	);

	const handleOpenEditWarehouseSesModal = (row: any) => {
		setUpdatedRow(row.original);
		setIsEditModal(true);
	};

	const onCloseEditWarehouseSesModal = () => {
		setUpdatedRow(dummyExportData);
		setIsEditModal(false);
	};

	const handleOpenDeleteWarehouseSesModal = (row: any) => {
		setDeletedRow(row.original);
		setIsDeleteModal(true);
	};

	const onCloseDeleteWarehouseSesModal = () => {
		setDeletedRow(dummyExportData);
		setIsDeleteModal(false);
	};

	const handleOpenCreateWarehouseSesModal = (row: any) => {
		setIsCreateModal(true);
	};

	const onCloseCreateWarehouseSesModal = () => {
		setIsCreateModal(false);
	};

	const handleSubmitDeleteWarehouseSesModal = async () => {
		try {
			const resData = await deleteExportSubs(deletedRow.ExpSubjectId);
			if (resData) {
				dispatch(setSnackbarMessage('Xóa thông tin thành công'));
				let deletedIdx = warehouseStudySession.findIndex(x => x.ExpSubjectId === deletedRow.ExpSubjectId);
				let newListOfLabs = [
					...warehouseStudySession.slice(0, deletedIdx),
					...warehouseStudySession.slice(deletedIdx + 1),
				];
				dispatch(setListOfWarehouseStudySession(newListOfLabs));
			} else {
				dispatch(setSnackbarMessage('Xóa thông tin không thành công'));
			}
		} catch (error) {
			dispatch(setSnackbarMessage('Xóa thông tin không thành công'));
		}
	};

	const handleSubmitEditWarehouseSesModal = async (updatedRow: any) => {
		const updateData = {
			ExpSubjectId: updatedRow.ExpSubjectId,
			ExportDate: Number(updatedRow.ExportDate),
			Content: updatedRow.Content,
			Semester: Number(updatedRow.Semester),
			Schoolyear: updatedRow.Schoolyear,
			SubjectId: updatedRow.SubjectId,
			EmployeeInCharge: updatedRow.EmployeeInCharge,
			EmployeeCreate: updatedRow.EmployeeCreate,
			listSub: updatedRow.listSub,
		};
		setCreatedRow(updateData);
		setIsCreateExportChemicalModal(true);
	};

	const handleSubmitCreateWarehouseSesModal = async (createdRow: any) => {
		try {
			const createData = {
				ExpSubjectId: createdRow.ExpSubjectId,
				ExportDate: Number(createdRow.ExportDate),
				Content: createdRow.Content,
				Semester: Number(createdRow.Semester),
				Schoolyear: createdRow.Schoolyear,
				SubjectId: createdRow.SubjectId,
				EmployeeInCharge: createdRow.EmployeeInCharge,
				EmployeeCreate: createdRow.EmployeeCreate,
				listSub: createdRow.listSub,
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
			ExpSubjectId: createdRow.ExpSubjectId,
		}));

		const createData: IExportType = {
			...createdRow,
			listSub: listChemicalExportUpdate,
		};
		const isExist: boolean = warehouseStudySession.findIndex(x => x.ExpSubjectId === createData.ExpSubjectId) > -1;
		if (isExist) {
			const resData = await updateExportSubs(createData);

			if (Object.keys(resData).length !== 0) {
				dispatch(setSnackbarMessage('Cập nhật thông tin thành công'));
				let updatedIdx = warehouseStudySession.findIndex(x => x.ExpSubjectId === createData.ExpSubjectId);
				let newListOfSubs = [
					...warehouseStudySession.slice(0, updatedIdx),
					createData,
					...warehouseStudySession.slice(updatedIdx + 1),
				];
				dispatch(setListOfWarehouseStudySession(newListOfSubs));
			} else {
				dispatch(setSnackbarMessage('Cập nhật thông tin không thành công'));
			}
		} else {
			const resData = await postExportSubs(createData);
			if (Object.keys(resData).length !== 0) {
				const newListOfSubs: IExportType = await getExportsSubById(createData?.ExpSubjectId || '');
				if (newListOfSubs) {
					dispatch(setSnackbarMessage('Tạo thông tin mới thành công'));
					dispatch(setListOfWarehouseStudySession([...warehouseStudySession, newListOfSubs]));
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
				muiTableDetailPanelProps={{
					sx: { background: '#f3f3f3' },
				}}
				initialState={{
					columnVisibility: {
						SessionId: false,
						EmployeeId: false,
						EmployeeInCharge: false,
						EmployeeCreate: false,
						SubjectId: false,
					},
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
							<Box>
								<Typography>
									<b>Người phụ trách: </b>
									{`${row.original.EmployeeInCharge} - ${row.original.EmployeeInChargeName}`}
								</Typography>
								<Typography>
									<b>Người tạo: </b>
									{`${row.original.EmployeeCreate} - ${row.original.EmployeeCreateName}`}
								</Typography>
								<Typography>
									<b>Môn học: </b>
									{`${row.original.SubjectId} - ${row.original.SubjectName}`}
								</Typography>
							</Box>
							<ChemicalTable
								warehouseData={warehouseStudySession}
								row={row}
								columns={columnsChemicalTable.current}
								type="SUB"
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

						<span>Quản lý phiếu xuất buổi học</span>
					</h3>
				)}
				renderRowActions={({ row, table }) => (
					<>
						<Tooltip arrow placement="left" title="Sửa thông tin phiếu xuất đăng kí chung">
							<IconButton onClick={() => handleOpenEditWarehouseSesModal(row)}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip arrow placement="right" title="Xoá thông tin phiếu xuất đăng kí chung">
							<IconButton color="error" onClick={() => handleOpenDeleteWarehouseSesModal(row)}>
								<Delete />
							</IconButton>
						</Tooltip>
					</>
				)}
				renderBottomToolbarCustomActions={() => (
					<Tooltip title="Tạo phiếu xuất đăng kí chung mới" placement="right-start">
						<Button
							color="primary"
							onClick={handleOpenCreateWarehouseSesModal}
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
					onClose={onCloseDeleteWarehouseSesModal}
					title="Xoá thông tin phiếu xuất buổi học"
					handleSubmit={handleSubmitDeleteWarehouseSesModal}
				>
					<span>Bạn có chắc muốn xoá thông tin </span>
					<Typography component="span" color="red">
						{deletedRow.ExpSubjectId} - {deletedRow.Content} - {deletedRow.EmployeeCreateName}
					</Typography>
					<span> không?</span>
				</DeleteExportModal>
			)}

			{isCreateModal && (
				<CreateExportModal
					onClose={onCloseCreateWarehouseSesModal}
					columns={columns}
					isCreateModal={isCreateModal}
					handleSubmitCreateModal={handleSubmitCreateWarehouseSesModal}
				/>
			)}
			{isEditModal && (
				<EditExportModal
					initData={updatedRow}
					isEditModal={isEditModal}
					columns={columns}
					onClose={onCloseEditWarehouseSesModal}
					handleSubmitEditModal={handleSubmitEditWarehouseSesModal}
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
					type="SUB"
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
			)} */}
		</>
	);

	return <></>;
};

export default StudySessionTabItem;
