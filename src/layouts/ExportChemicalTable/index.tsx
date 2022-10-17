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
import MaterialReactTable, { MaterialReactTableProps, MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setSnackbarMessage } from '../../pages/appSlice';
import {
	deleteExportChemical,
	getExportChemical,
	postExportChemicals,
	putExportChemical,
} from '../../services/exportChemicalServices';
import { RootState } from '../../store';
import { dummyExportChemicalData, IExportChemicalType } from '../../types/exportChemicalType';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import { setListOfExportChemical } from './exportChemicalSlice';

const ExportChemicalTable: FC = () => {
	const exportChemicalData = useAppSelector((state: RootState) => state.exportChemical.listOfExportChemical);
	const chemicalsData = useAppSelector((state: RootState) => state.chemical.listOfChemicals);
	const nanufacturersData = useAppSelector((state: RootState) => state.manufacturer.listOfManufacturers);

	const [isCreateModal, setIsCreateModal] = useState(false);
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
	const [tableData, setTableData] = useState<IExportChemicalType[]>([]);
	const [validationErrors, setValidationErrors] = useState<{
		[cellId: string]: string;
	}>({});

	const dispatch = useAppDispatch();

	const [updatedRow, setUpdatedRow] = useState<any>(dummyExportChemicalData);
	const [deletedRow, setDeletedRow] = useState<any>(dummyExportChemicalData);

	useEffect(() => {
		let formatedDeviceData = exportChemicalData.map((x: IExportChemicalType) => {
			let chemicalInfoIdx = chemicalsData.findIndex(y => y.ChemicalId === x.ChemicalId);
			let manufacturerInfoIdx = nanufacturersData.findIndex(
				m => m.ManufacturerId === chemicalsData[chemicalInfoIdx].ManufacturerId,
			);
			return {
				...x,
				ChemicalName: chemicalInfoIdx > -1 ? chemicalsData[chemicalInfoIdx].ChemicalName : '',
				Origin: chemicalInfoIdx > -1 ? chemicalsData[chemicalInfoIdx].Origin : '',
				ManufacturerName: manufacturerInfoIdx > -1 ? nanufacturersData[manufacturerInfoIdx].Name : '',
			};
		});
		setTableData(formatedDeviceData);
	}, [exportChemicalData]);

	const getCommonEditTextFieldProps = useCallback(
		(
			cell: MRT_Cell<IExportChemicalType>,
		): MRT_ColumnDef<IExportChemicalType>['muiTableBodyCellEditTextFieldProps'] => {
			return {
				error: !!validationErrors[cell.id],
				helperText: validationErrors[cell.id],
			};
		},
		[validationErrors],
	);

	const columns = useMemo<MRT_ColumnDef<IExportChemicalType>[]>(
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

	const handleOpenDeleteModal = (row: any) => {
		setDeletedRow(row.original);
		setIsDeleteModal(true);
	};

	const onCloseDeleteModal = () => {
		setDeletedRow(dummyExportChemicalData);
		setIsDeleteModal(false);
	};

	const handleSubmitDeleteModal = async () => {
		try {
			const data = await deleteExportChemical(deletedRow.ExportId, deletedRow.ChemicalId);
			if (data) {
				dispatch(setSnackbarMessage('Xóa thông tin thành công'));
				let deletedIdx = exportChemicalData.findIndex(
					x => x.ExportId === deletedRow.ExportId && x.ChemicalId === deletedRow.ChemicalId,
				);
				let newListOfExportChemical = [
					...exportChemicalData.slice(0, deletedIdx),
					...exportChemicalData.slice(deletedIdx + 1),
				];
				dispatch(setListOfExportChemical(newListOfExportChemical));
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
			const data: IExportChemicalType = {
				ExportId: createdRow.ExportId,
				ChemicalId: el.ChemicalId,
				Amount: el.Amount,
			};
			return data;
		});
		const resData = await postExportChemicals(newExportChemicals);
		if (Object.keys(resData).length !== 0) {
			const newListOfExportChemical: IExportChemicalType[] = await getExportChemical();
			if (newListOfExportChemical) {
				dispatch(setSnackbarMessage('Tạo thông tin thành công'));
				dispatch(setListOfExportChemical(newListOfExportChemical));
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
		setUpdatedRow(dummyExportChemicalData);
		setIsEditModal(false);
	};

	const handleSubmitEditModal = async (updatedRowComplete: any) => {
		const updateData: IExportChemicalType = {
			ChemicalId: updatedRowComplete.ChemicalId.toString(),
			Amount: Number(updatedRowComplete.Amount),
			ExportId: updatedRow.ExportId,
		};
		const resData = await putExportChemical(updatedRow.ExportId, updatedRow.ChemicalId, updateData);

		if (Object.keys(resData).length !== 0) {
			dispatch(setSnackbarMessage('Cập nhật thành công'));
			let updatedIdx = exportChemicalData.findIndex(
				x => x.ChemicalId === updatedRow.ChemicalId && x.ExportId === updatedRow.ExportId,
			);
			let newListOfDeviceSpecs = [
				...exportChemicalData.slice(0, updatedIdx),
				updateData,
				...exportChemicalData.slice(updatedIdx + 1),
			];
			dispatch(setListOfExportChemical(newListOfDeviceSpecs));
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
						<span>Quản lý phiếu xuất hóa chất</span>
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
						Bạn có chắc muốn xoá thông tin phiếu xuất hóa chất{' '}
						<Typography component="span" color="red">
							{deletedRow.ExportId} - {deletedRow.ChemicalId} - {deletedRow.ChemicalName}
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

export default ExportChemicalTable;
