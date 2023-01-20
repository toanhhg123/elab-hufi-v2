import { Delete, Edit } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
	Autocomplete,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
	Tooltip,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setSnackbarMessage } from '../../pages/appSlice';
import { deleteRegisterGeneral, updateRegisterGeneral } from '../../services/registerGeneralServices';
import { RootState } from '../../store';
import { dummyRegisterGeneralData, IRegisterGeneralType } from '../../types/registerGeneralType';
import DialogExportInstrument from './DialogExportInstrument';
import RegisterGeneralChemicalTable from './RegisterGeneralChemicalTable';
import RegisterGeneralDeviceTable from './RegisterGeneralDeviceTable';
import RegisterGeneralInstrumentTable from './RegisterGeneralInstrumentTable';
import { setListOfRegisterGenerals } from './registerGeneralSlice';
import RegisterGeneralToolTable from './RegisterGeneralToolTable';
import { ColumnType } from './Utils';

const RegisterGeneralsTable: FC = () => {
  const registerGeneralsData = useAppSelector((state: RootState) => state.registerGeneral.listOfRegisterGenerals);
  const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
  const researcherData = useAppSelector((state: RootState) => state.researchTeam.listOfResearchers);
  const dispatch = useAppDispatch();
  const [isExportInstrumentModal, setIsExportInstrumentModal] = useState<boolean>(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IRegisterGeneralType[]>([]);
  const [employeeDataValue, setEmployeeDataValue] = useState<any>([]);
  const [researcherDataValue, setResearcherDataValue] = useState<any>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

	const [updatedRow, setUpdatedRow] = useState<any>(dummyRegisterGeneralData);
	const [deletedRow, setDeletedRow] = useState<any>(dummyRegisterGeneralData);
	const [createdRow, setCreatedRow] = useState<any>(dummyRegisterGeneralData);

	useEffect(() => {
		if (employeeData.length > 0) {
			const list = employeeData.map(x => ({
				label: `${x.EmployeeId} - ${x.Fullname}`,
				id: x.EmployeeId,
				name: x.Fullname,
			}));
			setEmployeeDataValue(list);
		}
	}, [employeeData]);

  useEffect(() => {
    if (researcherData.length > 0) {
      const list = researcherData.map(x => ({
        label: `${x.ResearcherId} - ${x.Fullname}`,
        id: x.ResearcherId,
        name: x.Fullname
      }));
      setResearcherDataValue(list);
    }
  }, [researcherData])

  useEffect(() => {
    if (registerGeneralsData.length > 0) {
      let formatedRegisterGeneral = registerGeneralsData.map((item: IRegisterGeneralType) => {
        return Object.assign({}, {
          ...item,
          formatedDateCreate: moment.unix(Number(item.DateCreate)).format('DD/MM/YYYY'),
          formatedStartDate: moment.unix(Number(item.StartDate)).format('DD/MM/YYYY'),
          formatedEndDate: moment.unix(Number(item.EndDate)).format('DD/MM/YYYY'),
        })
      })
      setTableData(formatedRegisterGeneral);
    }

  }, [registerGeneralsData])

	const getCommonEditTextFieldProps = useCallback(
		(
			cell: MRT_Cell<IRegisterGeneralType>,
		): MRT_ColumnDef<IRegisterGeneralType>['muiTableBodyCellEditTextFieldProps'] => {
			return {
				error: !!validationErrors[cell.id],
				helperText: validationErrors[cell.id],
			};
		},
		[validationErrors],
	);

	const columns = useMemo<MRT_ColumnDef<IRegisterGeneralType>[]>(
		() => [
		  {
			accessorKey: 'RegisterGeneralId',
			header: 'Mã phiếu ĐK',
		  },
		  {
			accessorKey: 'formatedDateCreate',
			header: 'Ngày tạo',
		  },
		  {
			accessorKey: 'InstructorName',
			header: 'Người hướng dẫn',
		  },
		  {
			accessorKey: 'ThesisName',
			header: 'Tên luận văn',
		  },
		  {
			accessorKey: 'ResearchSubject',
			header: 'Chủ đề nghiên cứu',
		  },
		  {
			accessorKey: 'formatedStartDate',
			header: 'Ngày BĐ',
		  },
		  {
			accessorKey: 'formatedEndDate',
			header: 'Ngày KT',
		  },
		  // {
		  //   accessorKey: 'ResearcherId',
		  //   header: 'Mã nghiên cứu viên',
		  // },
		  {
			accessorKey: 'ResearcherName',
			header: 'Tên nghiên cứu viên',
		  },
		  // {
		  //   accessorKey: 'EmployeeId',
		  //   header: 'Mã nhân viên',
		  // },
		  {
			accessorKey: 'EmployeeName',
			header: 'Tên nhân viên',
		  },
		],
		[getCommonEditTextFieldProps],
	  );
	
	  const RegisterGeneralChemicalTableColumns = useRef<ColumnType[]>([
		{
		  id: 'Purpose',
		  header: 'Mục đích',
		},
		{
		  id: 'ChemicalId',
		  header: 'Mã hoá chất',
		},
		{
		  id: 'ChemicalName',
		  header: 'Tên hoá chất',
		},
		{
		  id: 'Specifications',
		  header: 'CTHH',
		},
		{
		  id: 'Amount',
		  header: 'Số lượng',
		  renderValue: (Amount, Unit) => `${Amount} (${Unit})`
		},
		{
		  id: 'Note',
		  header: 'Ghi chú',
		}
	  ]);
	
	  const RegisterGeneralDeviceTableColumns = useRef<ColumnType[]>([
		{
		  id: 'Purpose',
		  header: 'Mục đích',
		},
		{
		  id: 'DeviceId',
		  header: 'Mã thiết bị',
		},
		{
		  id: 'DeviceName',
		  header: 'Tên thiết bị',
		},
		{
		  id: 'Standard',
		  header: 'Quy cách',
		},
		{
		  id: 'Quantity',
		  header: 'Số lượng',
		  renderValue: (Quantity, Unit) => `${Quantity} (${Unit})`
		},
		{
		  id: 'Note',
		  header: 'Ghi chú',
		}
	  ]);

	const handleOpenEditModal = (row: any) => {
		setUpdatedRow(row.original);
		setIsEditModal(true);
	};

	const onCloseEditModal = () => {
		setUpdatedRow(dummyRegisterGeneralData);
		setIsEditModal(false);
	};

	const handleSubmitEditModal = async () => {
		const isUpdatedSuccess = await updateRegisterGeneral(updatedRow);
		if (isUpdatedSuccess) {
			dispatch(setSnackbarMessage('Cập nhật thông tin phiếu đăng ký chung thành công'));
			let updatedIdx = registerGeneralsData.findIndex(x => x.RegisterGeneralId === updatedRow.RegisterGeneralId);
			let newListOfRegisterGenerals = [
				...registerGeneralsData.slice(0, updatedIdx),
				updatedRow,
				...registerGeneralsData.slice(updatedIdx + 1),
			];
			dispatch(setListOfRegisterGenerals(newListOfRegisterGenerals));
		}

		onCloseEditModal();
	};

	const handleOpenDeleteModal = (row: any) => {
		setDeletedRow(row.original);
		setIsDeleteModal(true);
	};

	const onCloseDeleteModal = () => {
		setDeletedRow(dummyRegisterGeneralData);
		setIsDeleteModal(false);
	};

	const handleSubmitDeleteModal = async () => {
		await deleteRegisterGeneral(deletedRow.RegisterGeneralId);
		dispatch(setSnackbarMessage('Xóa thông tin phiếu đăng ký chung thành công'));
		let deletedIdx = registerGeneralsData.findIndex(x => x.RegisterGeneralId === deletedRow.RegisterGeneralId);
		let newListOfRegisterGenerals = [
			...registerGeneralsData.slice(0, deletedIdx),
			...registerGeneralsData.slice(deletedIdx + 1),
		];
		dispatch(setListOfRegisterGenerals(newListOfRegisterGenerals));

		onCloseDeleteModal();
	};

	const handleOpenCreateModal = (row: any) => {
		setIsCreateModal(true);
	};

	const onCloseCreateModal = () => {
		setCreatedRow(dummyRegisterGeneralData);
		setIsCreateModal(false);
	};

	const handleOpenExportInstrumenModal = () => {
		setIsExportInstrumentModal(true);
	};

	const handleCloseExportInstrumentModal = () => {
		setIsExportInstrumentModal(false);
	};

	const handleSubmitCreateModal = async () => {
		// const createdRegisterGeneral = await postRegisterGeneral({
		//   "Name": createdRow.Name,
		//   "Email": createdRow.Email,
		//   "PhoneNumber": createdRow.PhoneNumber,
		//   "Address": createdRow.Address,
		// })
		// if (createdRegisterGeneral) {
		//   const newListOfRegisterGenerals: IRegisterGeneralType[] = await getRegisterGenerals();
		//   if (newListOfRegisterGenerals) {
		//     dispatch(setSnackbarMessage("Tạo thông tin phiếu đăng ký chung mới thành công"));
		//     dispatch(setListOfRegisterGenerals(newListOfRegisterGenerals));
		//   }
		// }
		// onCloseCreateModal();
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
					columnOrder: [
						'mrt-row-expand',
						'mrt-row-numbers',
						...columns.map(x => x.accessorKey || ''),
						'mrt-row-actions',
					],
				}}
				renderDetailPanel={({ row }) => (
					<>
						{row.original.ListChemical.length > 0 && (
							<RegisterGeneralChemicalTable
								chemicalData={row.original.ListChemical}
								columns={RegisterGeneralChemicalTableColumns.current}
							/>
						)}
						{row.original.ListDevice.length > 0 && (
							<RegisterGeneralDeviceTable
								deviceData={row.original.ListDevice}
								columns={RegisterGeneralDeviceTableColumns.current}
							/>
						)}
					</>
				)}
				renderRowActions={({ row, table }) => (
					<>
						<Tooltip arrow placement="left" title="Sửa thông tin phiếu đăng ký chung">
							<IconButton onClick={() => handleOpenEditModal(row)}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip arrow placement="right" title="Xoá thông tin phiếu đăng ký chung">
							<IconButton color="error" onClick={() => handleOpenDeleteModal(row)}>
								<Delete />
							</IconButton>
						</Tooltip>
					</>
				)}
				renderTopToolbarCustomActions={() => (
					<Box>
						<h3 style={{ margin: '0px', marginBottom: '12px' }}>
							<b>
								<KeyboardArrowRightIcon
									style={{ margin: '0px', fontSize: '30px', paddingTop: '15px' }}
								></KeyboardArrowRightIcon>
							</b>
							<span>Thông tin phiếu đăng ký chung</span>
						</h3>
						<Box textAlign="left">
							<Button variant="contained" onClick={handleOpenExportInstrumenModal}>
								Xuất dụng cụ
							</Button>
						</Box>
					</Box>
				)}
				renderBottomToolbarCustomActions={() => (
					<Tooltip title="Tạo phiếu đăng ký chung mới" placement="right-start">
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

			{isExportInstrumentModal && (
				<DialogExportInstrument isOpen={isExportInstrumentModal} onClose={handleCloseExportInstrumentModal} />
			)}

			<Dialog open={isEditModal}>
				<DialogTitle textAlign="center">
					<b>Sửa thông tin phiếu đăng ký chung</b>
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
							{columns.map(column => {
								if (
									column.accessorKey === 'RegisterGeneralId' ||
									column.accessorKey === 'formatedDateCreate'
								) {
									return (
										<TextField
											disabled
											key={'Updated' + column.accessorKey}
											label={column.header}
											name={column.accessorKey}
											defaultValue={updatedRow[column.accessorKey]}
										/>
									);
								} else if (
									column.accessorKey === 'formatedStartDate' ||
									column.accessorKey === 'formatedEndDate'
								) {
									return (
										<LocalizationProvider dateAdapter={AdapterMoment}>
											<DatePicker
												key={'Update' + column.accessorKey}
												label={column.header}
												value={new Date(updatedRow[`${column.accessorKey.slice(8)}`] * 1000)}
												onChange={(val: any) => {
													setUpdatedRow({
														...updatedRow,
														[`${column.accessorKey}`]: moment
															.unix(Date.parse(val) / 1000)
															.format('DD/MM/YYYY'),
														[`${column?.accessorKey?.slice(8)}`]: Date.parse(val) / 1000,
													});
												}}
												renderInput={(params: any) => (
													<TextField
														key={'UpdateTextField' + column.accessorKey}
														{...params}
													/>
												)}
												inputFormat="DD/MM/YYYY"
											/>
										</LocalizationProvider>
									);
								} else if (column.accessorKey === 'EmployeeName') {
									return (
										<Autocomplete
											key={column.accessorKey}
											options={employeeDataValue}
											noOptionsText="Không có kết quả trùng khớp"
											value={
												employeeDataValue.find((x: any) => x.id === updatedRow.EmployeeId) ||
												null
											}
											getOptionLabel={option => option?.label}
											renderInput={params => {
												return (
													<TextField
														{...params}
														label={column.header}
														placeholder="Nhập để tìm kiếm"
													/>
												);
											}}
											onChange={(event, value) => {
												setUpdatedRow({
													...updatedRow,
													EmployeeId: value?.id,
													EmployeeName: value?.name,
												});
											}}
										/>
									);
								} else {
									return (
										<TextField
											key={column.accessorKey}
											label={column.header}
											name={column.accessorKey}
											defaultValue={column.accessorKey && updatedRow[column.accessorKey]}
											onChange={e =>
												setUpdatedRow({ ...updatedRow, [e.target.name]: e.target.value })
											}
										/>
									);
								}
							})}
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
					<b>Xoá thông tin phiếu đăng ký chung</b>
				</DialogTitle>
				<DialogContent>
					<div>
						Bạn có chắc muốn xoá thông tin phiếu đăng ký chung {`${deletedRow.RegisterGeneralId}`} không?
					</div>
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
					<b>Tạo thông tin phiếu đăng ký chung</b>
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
							{columns.slice(2).map(column => {
								if (
									column.accessorKey === 'formatedStartDate' ||
									column.accessorKey === 'formatedEndDate'
								) {
									return (
										<LocalizationProvider dateAdapter={AdapterMoment}>
											<DatePicker
												key={'Create' + column.accessorKey}
												label={column.header}
												value={new Date(createdRow[`${column.accessorKey.slice(8)}`] * 1000)}
												onChange={(val: any) => {
													setCreatedRow({
														...createdRow,
														[`${column.accessorKey}`]: moment
															.unix(Date.parse(val) / 1000)
															.format('DD/MM/YYYY'),
														[`${column?.accessorKey?.slice(8)}`]: Date.parse(val) / 1000,
													});
												}}
												renderInput={(params: any) => (
													<TextField
														key={'CreateTextField' + column.accessorKey}
														{...params}
													/>
												)}
												inputFormat="DD/MM/YYYY"
											/>
										</LocalizationProvider>
									);
								} else if (column.accessorKey === 'EmployeeName') {
									return (
										<Autocomplete
											key={'CreateEmployeeName'}
											options={employeeDataValue}
											noOptionsText="Không có kết quả trùng khớp"
											sx={{ width: '450px' }}
											value={
												employeeDataValue.find((x: any) => x.id === createdRow.EmployeeId) ||
												null
											}
											getOptionLabel={option => option?.label}
											renderInput={params => {
												return (
													<TextField
														{...params}
														label={'Người lập'}
														placeholder="Nhập để tìm kiếm"
													/>
												);
											}}
											onChange={(event, value) => {
												setCreatedRow({
													...createdRow,
													EmployeeId: value?.id,
													EmployeeName: value?.name,
												});
											}}
										/>
									);
								} else {
									return (
										<TextField
											key={column.accessorKey}
											label={column.header}
											name={column.accessorKey}
											defaultValue={column.id && updatedRow[column.id]}
											onChange={e =>
												setCreatedRow({ ...createdRow, [e.target.name]: e.target.value })
											}
										/>
									);
								}
							})}
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
		</>
	);
};

export default React.memo(RegisterGeneralsTable);
