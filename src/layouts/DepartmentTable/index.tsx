import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import {
	AppBar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { dummyDepartmentData, IDepartmentType } from '../../types/departmentType';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteDepartment, getDepartments, postDepartment, updateDepartment } from '../../services/departmentServices';
import { RootState } from '../../store';
import { setListOfDepartments } from './departmentSlice';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { setSnackbarMessage } from '../../pages/appSlice';
import DeviceOfExperimentCenterTable from './DeviceOfExperimentCenterTable';
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import DeviceOfDepartmentTable from './DeviceOfDepartmentTable';
import { DeviceTable } from './context/DeviceOfDepartmentTableContext';

const DepartmentTable: FC = () => {
	const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);
	const dispatch = useAppDispatch();

	const [isCreateModal, setIsCreateModal] = useState(false);
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
	const [isDeviceTableModal, setIsDeviceTableModal] = useState<boolean>(false);
	const [departmentIdShow, setDepartmentIdShow] = useState<Number>();
	const [tableData, setTableData] = useState<IDepartmentType[]>([]);
	const [validationErrors, setValidationErrors] = useState<{
		[cellId: string]: string;
	}>({});

	const [updatedRow, setUpdatedRow] = useState<any>(dummyDepartmentData);
	const [deletedRow, setDeletedRow] = useState<any>(dummyDepartmentData);
	const [createdRow, setCreatedRow] = useState<any>(dummyDepartmentData);

	useEffect(() => {
		setTableData(departmentData);
	}, [departmentData]);

	const getCommonEditTextFieldProps = useCallback(
		(cell: MRT_Cell<IDepartmentType>): MRT_ColumnDef<IDepartmentType>['muiTableBodyCellEditTextFieldProps'] => {
			return {
				error: !!validationErrors[cell.id],
				helperText: validationErrors[cell.id],
			};
		},
		[validationErrors],
	);

	const columns = useMemo<MRT_ColumnDef<IDepartmentType>[]>(
		() => [
			{
				accessorKey: 'DepartmentName',
				header: 'Tên phòng ban',
				size: 100,
			},
			{
				accessorKey: 'Location',
				header: 'Địa điểm',
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
		setUpdatedRow(dummyDepartmentData);
		setIsEditModal(false);
	};

	const handleSubmitEditModal = async () => {
		const isUpdatedSuccess = await updateDepartment(updatedRow);
		if (isUpdatedSuccess) {
			dispatch(setSnackbarMessage('Cập nhật thông tin phòng ban thành công'));
			let updatedIdx = departmentData.findIndex(x => x.DepartmentId === updatedRow.DepartmentId);
			let newListOfDepartments = [
				...departmentData.slice(0, updatedIdx),
				updatedRow,
				...departmentData.slice(updatedIdx + 1),
			];
			dispatch(setListOfDepartments(newListOfDepartments));
		}

		onCloseEditModal();
	};

	const handleOpenDeleteModal = (row: any) => {
		setDeletedRow(row.original);
		setIsDeleteModal(true);
	};

	const onCloseDeleteModal = () => {
		setIsDeleteModal(false);
	};

	const handleSubmitDeleteModal = async () => {
		await deleteDepartment(deletedRow.DepartmentId);
		dispatch(setSnackbarMessage('Xóa thông tin phòng ban thành công'));
		let deletedIdx = departmentData.findIndex(x => x.DepartmentId === deletedRow.DepartmentId);
		let newListOfDepartments = [...departmentData.slice(0, deletedIdx), ...departmentData.slice(deletedIdx + 1)];
		dispatch(setListOfDepartments(newListOfDepartments));

		setIsDeleteModal(false);
		setDeletedRow(dummyDepartmentData);
	};

	const handleOpenCreateModal = (row: any) => {
		setIsCreateModal(true);
	};

	const onCloseCreateModal = () => {
		setCreatedRow(dummyDepartmentData);
		setIsCreateModal(false);
	};

	const handleOpenDeviceTableModal = (id: Number | undefined) => {
		if (id !== undefined) {
			setIsDeviceTableModal(true);
			setDepartmentIdShow(id);
		}
	};

	const handleSubmitCreateModal = async () => {
		const createdDepartment = await postDepartment({
			DepartmentName: createdRow.DepartmentName,
			Location: createdRow.Location,
		});

		if (createdDepartment) {
			const newListOfDepartments: IDepartmentType[] = await getDepartments();
			if (newListOfDepartments) {
				dispatch(setSnackbarMessage('Tạo thông tin phòng ban mới thành công'));
				dispatch(setListOfDepartments(newListOfDepartments));
			}
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
					columnOrder: ['mrt-row-numbers', ...columns.map(x => x.accessorKey || ''), 'mrt-row-actions'],
				}}
				renderTopToolbarCustomActions={() => (
					<h3 style={{ margin: '0px' }}>
						<b>
							<KeyboardArrowRightIcon
								style={{ margin: '0px', fontSize: '30px', paddingTop: '15px' }}
							></KeyboardArrowRightIcon>
						</b>
						<span>Thông tin phòng ban</span>
					</h3>
				)}
				renderRowActions={({ row, table }) => (
					<>
						<Tooltip arrow placement="left" title="Xem chi tiết thiết bị">
							<IconButton onClick={() => handleOpenDeviceTableModal(row.original.DepartmentId)}>
								<PreviewIcon />
							</IconButton>
						</Tooltip>
						<Tooltip arrow placement="left" title="Sửa thông tin phòng ban">
							<IconButton onClick={() => handleOpenEditModal(row)}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip arrow placement="right" title="Xoá thông tin phòng ban">
							<IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
								<Delete />
							</IconButton>
						</Tooltip>
					</>
				)}
				renderBottomToolbarCustomActions={() => (
					<Tooltip title="Tạo phòng ban mới" placement="right-start">
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

			<Dialog open={isEditModal}>
				<DialogTitle textAlign="center">
					<b>Sửa thông tin phòng ban</b>
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
							{columns.map(column =>
								column.id === 'DepartmentId' ? (
									<TextField
										disabled
										key="DepartmentId"
										label="DepartmentId"
										name="DepartmentId"
										defaultValue={updatedRow['DepartmentId']}
									/>
								) : (
									<TextField
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.id && updatedRow[column.id]}
										onChange={e =>
											setUpdatedRow({ ...updatedRow, [e.target.name]: e.target.value })
										}
									/>
								),
							)}
						</Stack>
					</form>
				</DialogContent>
				<DialogActions sx={{ p: '1.25rem' }}>
					<Button onClick={onCloseEditModal}>Hủy</Button>
					<Button color="primary" onClick={handleSubmitEditModal} variant="contained">
						Lưu thay đổi
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={isDeleteModal}>
				<DialogTitle textAlign="center">
					<b>Xoá thông tin phòng ban</b>
				</DialogTitle>
				<DialogContent>
					<div>Bạn có chắc muốn xoá thông tin phòng ban {`${deletedRow.DepartmentName}`} không?</div>
				</DialogContent>
				<DialogActions sx={{ p: '1.25rem' }}>
					<Button onClick={onCloseDeleteModal}>Hủy</Button>
					<Button color="primary" onClick={handleSubmitDeleteModal} variant="contained">
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={isCreateModal}>
				<DialogTitle textAlign="center">
					<b>Tạo thông tin phòng ban</b>
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
							{columns.map(column => (
								<TextField
									key={column.accessorKey}
									label={column.header}
									name={column.accessorKey}
									defaultValue={column.id && updatedRow[column.id]}
									onChange={e => setCreatedRow({ ...createdRow, [e.target.name]: e.target.value })}
								/>
							))}
						</Stack>
					</form>
				</DialogContent>
				<DialogActions sx={{ p: '1.25rem' }}>
					<Button onClick={onCloseCreateModal}>Hủy</Button>
					<Button color="primary" onClick={handleSubmitCreateModal} variant="contained">
						Tạo
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog fullScreen open={isDeviceTableModal} onClose={() => setIsDeviceTableModal(false)}>
				<AppBar sx={{ position: 'relative', marginBottom: '24px' }}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={() => setIsDeviceTableModal(false)}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
							Thông tin thiết bị trong{' '}
							<b>{departmentData.length > 0 ? departmentData.find(x => x.DepartmentId === departmentIdShow)?.DepartmentName : ''}</b>
						</Typography>
					</Toolbar>
				</AppBar>
				{departmentIdShow === 1 && (
					<>
						<DeviceOfExperimentCenterTable id={departmentIdShow}/>
					</>
				)}
				{departmentIdShow !== 1 && (
					<DeviceTable id={departmentIdShow || 0}>
						<DeviceOfDepartmentTable />
					</DeviceTable>
				)}
			</Dialog>
		</>
	);
};

export default DepartmentTable;
