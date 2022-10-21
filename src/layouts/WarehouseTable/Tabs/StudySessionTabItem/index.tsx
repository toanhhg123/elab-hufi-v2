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
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import * as API from '../../../../configs/apiHelper';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { setSnackbarMessage } from '../../../../pages/appSlice';
import { deleteExportChemical } from '../../../../services/exportChemicalServices';
import { deleteExportDevice } from '../../../../services/exportDeviceServices';
import {
	deleteWarehouse,
	getWarehouseFeildId,
	postWarehouse,
	updateWarehouse,
} from '../../../../services/warehouseServices';
import { RootState } from '../../../../store';
import { IChemicalType } from '../../../../types/chemicalType';
import { IExportChemicalType } from '../../../../types/exportChemicalType';
import { IExportDeviceType } from '../../../../types/exportDeviceType';
import { dummyWarehouseData, IWarehouseType } from '../../../../types/warehouseType';
import CreateExportChemicalModal from '../../Modal/CreateExportChemicalModal';
import CreateExportDeviceModal from '../../Modal/CreateExportDeviceModal';
import CreateExportModal from '../../Modal/CreateExportModal';
import DeleteExportChemicalModal from '../../Modal/DeleteExportChemicalModal';
import DeleteExportDeviceModal from '../../Modal/DeleteExportDeviceModal';
import { DeleteExportModal } from '../../Modal/DeleteExportModal';
import EditExportChemicalModal from '../../Modal/EditExportChemicalModal';
import EditExportDeviceModal from '../../Modal/EditExportDeviceModal';
import EditExportModal from '../../Modal/EditExportModal';
import { setListOfWarehouseStudySession } from '../../warehouseSlice';

const StyledTableCell = styled(TableCell)(theme => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: 'lightgray',
	},
}));

const StudySessionTabItem: FC = () => {
	const warehouseStudySession = useAppSelector((state: RootState) => state.warehouse.listOfWarehouseStudySession);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const exportChemicalData = useAppSelector((state: RootState) => state.exportChemical.listOfExportChemical);
	const chemicalsData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
	const nanufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);
	const exportDeviceData = useAppSelector((state: RootState) => state.exportDevice.listOfExportDevice);
	const deviceData = useAppSelector((state: RootState) => state.device.listOfDevices);
	const studySessionData = useAppSelector((state: RootState) => state.studySession.listOfStudySession);

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
		let formatedDeviceData = warehouseStudySession.map((x: IWarehouseType) => {
			let employeeInfoIdx = employeeData.findIndex(y => y.EmployeeID === x.EmployeeId);
			let studySessionInfoIdx = studySessionData?.findIndex(y => y.SessionId === x.SessionId);
			return {
				...x,
				formatedExportDate: moment.unix(x.ExportDate).format('DD/MM/YYYY'),
				EmployeeName: employeeInfoIdx > -1 ? employeeData[employeeInfoIdx].Fullname : '',
				TeacherName: studySessionInfoIdx > -1 ? studySessionData[studySessionInfoIdx].TeacherName : '',
				ClassId: studySessionInfoIdx > -1 ? studySessionData[studySessionInfoIdx].ClassId : '',
				ClassName: studySessionInfoIdx > -1 ? studySessionData[studySessionInfoIdx].ClassName : '',
				LabName: studySessionInfoIdx > -1 ? studySessionData[studySessionInfoIdx].LabName : '',
			};
		});
		setTableData(formatedDeviceData);
	}, [warehouseStudySession, studySessionData]);

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
				accessorKey: 'SessionId',
				header: 'SessionId',
				size: 140,
			},
			{
				accessorKey: 'ClassId',
				header: 'Mã lớp',
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
				accessorKey: 'TeacherName',
				header: 'Giảng viên',
				size: 140,
				enableHiding: false,
			},
			{
				accessorKey: 'ClassName',
				header: 'Tên lớp',
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

	const handleOpenEditWarehouseSesModal = (row: any) => {
		setUpdatedRow(row.original);
		setIsEditModal(true);
	};

	const onCloseEditWarehouseSesModal = () => {
		setUpdatedRow(dummyWarehouseData);
		setIsEditModal(false);
	};

	const handleSubmitEditWarehouseSesModal = async (updatedRow: any) => {
		const updateData = {
			ExportId: updatedRow.ExportId,
			ExportDate: updatedRow.ExportDate.toString(),
			Content: updatedRow.Content,
			Status: updatedRow.Status,
			EmployeeId: updatedRow.EmployeeId,
			SessionId: updatedRow.SessionId,
		};
		console.log(updateData);
		const resData = await updateWarehouse('ses', updatedRow.ExportId, updateData);

		if (Object.keys(resData).length !== 0) {
			dispatch(setSnackbarMessage('Cập nhật thông tin thành công'));
			let updatedIdx = warehouseStudySession.findIndex(x => x.ExportId === updatedRow.ExportId);

			let newListOfStudySession = [
				...warehouseStudySession.slice(0, updatedIdx),
				updatedRow,
				...warehouseStudySession.slice(updatedIdx + 1),
			];
			dispatch(setListOfWarehouseStudySession(newListOfStudySession));
		} else {
			dispatch(setSnackbarMessage('Cập nhật thông tin không thành công'));
		}
	};

	const handleOpenDeleteWarehouseSesModal = (row: any) => {
		setDeletedRow(row.original);
		setIsDeleteModal(true);
	};

	const onCloseDeleteWarehouseSesModal = () => {
		setDeletedRow(dummyWarehouseData);
		setIsDeleteModal(false);
	};

	const handleSubmitDeleteWarehouseSesModal = async () => {
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
						let deletedIdx = warehouseStudySession.findIndex(x => x.ExportId === deletedRow.ExportId);
						let newListOfLabs = [
							...warehouseStudySession.slice(0, deletedIdx),
							...warehouseStudySession.slice(deletedIdx + 1),
						];
						dispatch(setListOfWarehouseStudySession(newListOfLabs));
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

	const handleOpenCreateWarehouseSesModal = (row: any) => {
		setIsCreateModal(true);
	};

	const onCloseCreateWarehouseSesModal = () => {
		setIsCreateModal(false);
	};

	const handleSubmitCreateWarehouseSesModal = async (createdRow: any) => {
		try {
			const createData = {
				ExportId: createdRow.ExportId,
				ExportDate: createdRow.ExportDate.toString(),
				Content: createdRow.Content,
				Status: createdRow.Status,
				EmployeeId: createdRow.EmployeeId,
				SessionId: createdRow.SessionId,
			};

			const resData = await postWarehouse('ses', createData);
			if (Object.keys(resData).length !== 0) {
				const newListOfRegisterGeneral: IWarehouseType[] = await getWarehouseFeildId('ses');
				if (newListOfRegisterGeneral) {
					dispatch(setSnackbarMessage('Tạo thông tin mới thành công'));
					dispatch(setListOfWarehouseStudySession(newListOfRegisterGeneral));
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
					columnVisibility: { SessionId: false, EmployeeId: false },
					density: 'compact',
					columnOrder: [
						'mrt-row-expand',
						'mrt-row-numbers',
						...columns.map(x => x.accessorKey || ''),
						'mrt-row-actions',
					],
				}}
				renderDetailPanel={({ row }) => {
					let formatedExportChemicalData = exportChemicalData
						.filter((x: IExportChemicalType) => x.ExportId === row.original.ExportId)
						.map((x: IExportChemicalType) => {
							let chemicalInfoIdx = chemicalsData.findIndex(
								(y: IChemicalType) => y.ChemicalId === x.ChemicalId,
							);
							let manufacturerInfoIdx = nanufacturersData.findIndex(
								m => m.ManufacturerId === chemicalsData[chemicalInfoIdx].ManufacturerId,
							);

							return {
								...x,
								ChemicalName: chemicalInfoIdx > -1 ? chemicalsData[chemicalInfoIdx].ChemicalName : '',
								Origin: chemicalInfoIdx > -1 ? chemicalsData[chemicalInfoIdx].Origin : '',
								ManufacturerName:
									manufacturerInfoIdx > -1 ? nanufacturersData[manufacturerInfoIdx].Name : '',
							};
						});

					let formatedExportDeviceData = exportDeviceData
						.filter((x: IExportDeviceType) => x.ExportId === row.original.ExportId)
						.map((x: IExportDeviceType) => {
							let deviceIdx = deviceData.findIndex(y => y.DeviceId === x.DeviceId);
							return {
								...x,
								DeviceName: deviceIdx > -1 ? deviceData[deviceIdx].DeviceName : '',
								Origin: deviceIdx > -1 ? deviceData[deviceIdx].Origin : '',
								Model: deviceIdx > -1 ? deviceData[deviceIdx].Model : '',
							};
						});

					return (
						<>
							<Box
								component="div"
								alignItems="center"
								justifyContent="space-between"
								display="flex"
								mb={2}
							>
								<Typography fontWeight="bold">Bảng hóa chất</Typography>
								<Button
									variant="contained"
									onClick={() => {
										setCreatedRow(row.original);
										setIsCreateExportChemicalModal(true);
									}}
								>
									<AddIcon />
								</Button>
							</Box>
							<TableContainer component={Paper} sx={{ maxHeight: '200px', marginBottom: '24px' }}>
								<Table sx={{ minWidth: 650 }} stickyHeader size="small">
									<TableHead>
										<TableRow>
											<StyledTableCell align="left">
												<b>Mã hóa chất</b>
											</StyledTableCell>
											<StyledTableCell align="left">
												<b>Tên hóa chất</b>
											</StyledTableCell>
											<StyledTableCell align="left">
												<b>Số lượng</b>
											</StyledTableCell>
											<StyledTableCell align="left">
												<b>Nhà sản xuất</b>
											</StyledTableCell>
											<StyledTableCell align="left">
												<b>Xuất xứ</b>
											</StyledTableCell>
											<StyledTableCell align="left"></StyledTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{formatedExportChemicalData.map((exportChemical, index) => (
											<TableRow
												key={index}
												sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											>
												<TableCell align="left">{exportChemical.ChemicalId}</TableCell>
												<TableCell align="left">{exportChemical.ChemicalName}</TableCell>
												<TableCell align="left">{exportChemical.Amount.toString()}</TableCell>
												<TableCell align="left">{exportChemical.ManufacturerName}</TableCell>
												<TableCell align="left">{exportChemical.Origin}</TableCell>
												<TableCell align="right" size="small">
													<Tooltip
														arrow
														placement="left"
														title="Sửa thông tin phiếu xuất hóa chất"
													>
														<IconButton
															onClick={() => {
																setUpdatedRow(exportChemical);
																setIsEditExportChemicalModal(true);
															}}
														>
															<Edit />
														</IconButton>
													</Tooltip>
													<Tooltip arrow placement="right" title="Xoá phiếu xuất hóa chất">
														<IconButton
															color="error"
															onClick={() => {
																setDeletedRow(exportChemical);
																setIsDeleteExportChemicalModal(true);
															}}
														>
															<Delete />
														</IconButton>
													</Tooltip>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>

							<Box
								component="div"
								alignItems="center"
								justifyContent="space-between"
								display="flex"
								mb={2}
							>
								<Typography fontWeight="bold">Bảng thiết bị</Typography>
								<Button
									variant="contained"
									onClick={() => {
										setCreatedRow(row.original);
										setIsCreateExportDeviceModal(true);
									}}
								>
									<AddIcon />
								</Button>
							</Box>
							<TableContainer component={Paper} sx={{ maxHeight: '200px', marginBottom: '24px' }}>
								<Table sx={{ minWidth: 650 }} stickyHeader size="small">
									<TableHead>
										<TableRow>
											<StyledTableCell align="left">
												<b>Mã thiết bị</b>
											</StyledTableCell>
											<StyledTableCell align="left">
												<b>Tên thiết bị</b>
											</StyledTableCell>
											<StyledTableCell align="left">
												<b>Số lượng</b>
											</StyledTableCell>
											<StyledTableCell align="left">
												<b>Mẫu</b>
											</StyledTableCell>
											<StyledTableCell align="left">
												<b>Xuất xứ</b>
											</StyledTableCell>
											<StyledTableCell align="left"></StyledTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{formatedExportDeviceData.map((exportDevice, index) => (
											<TableRow
												key={index}
												sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											>
												<TableCell align="left">{exportDevice.DeviceId}</TableCell>
												<TableCell align="left">{exportDevice.DeviceName}</TableCell>
												<TableCell align="left">{exportDevice.Quantity.toString()}</TableCell>
												<TableCell align="left">{exportDevice.Model}</TableCell>
												<TableCell align="left">{exportDevice.Origin}</TableCell>
												<TableCell align="right" size="small">
													<Tooltip
														arrow
														placement="left"
														title="Sửa thông tin phiếu xuất thiết bị"
													>
														<IconButton
															onClick={() => {
																setUpdatedRow(exportDevice);
																setIsEditExportDeviceModal(true);
															}}
														>
															<Edit />
														</IconButton>
													</Tooltip>
													<Tooltip arrow placement="right" title="Xoá phiếu xuất thiết bị">
														<IconButton
															color="error"
															onClick={() => {
																setDeletedRow(exportDevice);
																setIsDeleteExportDeviceModal(true);
															}}
														>
															<Delete />
														</IconButton>
													</Tooltip>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
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
					Bạn có chắc muốn xoá thông tin{' '}
					<Typography component="span" color="red">
						{deletedRow.ExportId} - {deletedRow.Content} - {deletedRow.EmployeeName}
					</Typography>{' '}
					không?
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

export default StudySessionTabItem;
