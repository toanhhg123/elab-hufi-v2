import {
	Button,
	debounce,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { IWarehouseType } from '../../../types/warehouseType';

type CreateLabModalProps = {
	isEditModal: boolean;
	columns: MRT_ColumnDef<IWarehouseType>[];
	onCloseEditModal: React.MouseEventHandler;
	handleSubmitEditModal: Function;
	initData: any;
};

const EditLabModal: FC<CreateLabModalProps> = ({
	isEditModal,
	columns,
	onCloseEditModal,
	handleSubmitEditModal,
	initData,
}: CreateLabModalProps) => {
	const [updatedRow, setUpdatedRow] = useState<any>(() => initData);
	const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const registerGeneralData = useAppSelector((state: RootState) => state.registerGeneral.listOfRegisterGeneral);

	const handleSubmit = () => {
		handleSubmitEditModal(updatedRow);
	};

	useEffect(() => {
		setUpdatedRow(initData);
	}, [isEditModal, initData]);

	return (
		<Dialog open={isEditModal}>
			<DialogTitle textAlign="center">
				<b>Sửa thông tin Lab</b>
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
							if (column.id === 'ExportId') {
								return (
									<TextField
										disabled
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.id && updatedRow[column.id]}
									/>
								);
							} else if (column.id === 'formatedExportDate') {
								return (
									<LocalizationProvider dateAdapter={AdapterMoment} key={column.id}>
										<DatePicker
											label="Ngày sinh"
											value={new Date(updatedRow.ExportDate * 1000)}
											onChange={(val: any) =>
												setUpdatedRow({
													...updatedRow,
													formatedExportDate: moment
														.unix(Date.parse(val) / 1000)
														.format('DD/MM/YYYY'),
													ExportDate: Date.parse(val) / 1000,
												})
											}
											renderInput={(params: any) => <TextField {...params} />}
											inputFormat="DD/MM/YYYY"
										/>
									</LocalizationProvider>
								);
							} else if (column.id === 'LabName' && laboratoriesData.length > 0) {
								return (
									<FormControl sx={{ m: 0, minWidth: 120 }} key={column.id}>
										<InputLabel id="laboratories-select-required-label">
											Phòng thí nghiệm
										</InputLabel>
										<Select
											labelId="laboratories-select-required-label"
											id="laboratories-select-required"
											value={
												laboratoriesData.findIndex(x => x.LabId === updatedRow.LabId) > -1
													? laboratoriesData
															.findIndex(x => x.LabId === updatedRow.LabId)
															.toString()
													: ''
											}
											label="Phòng thí nghiệm"
											onChange={(e: SelectChangeEvent) =>
												setUpdatedRow({
													...updatedRow,
													LabName: laboratoriesData[Number(e.target.value)].LabName,
													LabId: laboratoriesData[Number(e.target.value)].LabId,
												})
											}
										>
											{laboratoriesData.map((x, idx) => (
												<MenuItem key={idx} value={idx}>
													{x.LabName}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								);
							} else if (column.id === 'EmployeeName' && employeeData.length > 0) {
								return (
									<FormControl sx={{ m: 0, minWidth: 120 }} key={column.id}>
										<InputLabel id="employees-select-required-label">Người xuất</InputLabel>
										<Select
											labelId="employees-select-required-label"
											id="employees-select-required"
											value={
												employeeData.findIndex(x => x.EmployeeID === updatedRow.EmployeeId) > -1
													? employeeData
															.findIndex(x => x.EmployeeID === updatedRow.EmployeeId)
															.toString()
													: ''
											}
											label="Người xuất"
											onChange={(e: SelectChangeEvent) =>
												setUpdatedRow({
													...updatedRow,
													EmployeeName: employeeData[Number(e.target.value)].Fullname,
													EmployeeId: employeeData[Number(e.target.value)].EmployeeID,
												})
											}
										>
											{employeeData.map((x, idx) => (
												<MenuItem key={idx} value={idx}>
													{x.EmployeeID} - {x.Fullname}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								);
							} else if (column.id === 'Status' && employeeData.length > 0) {
								return (
									<FormControl sx={{ m: 0, minWidth: 120 }} key={column.id}>
										<InputLabel id="status-select-required-label">Trạng thái</InputLabel>
										<Select
											labelId="status-select-required-label"
											id="status-select-required"
											value={
												['True', 'Fasle'].findIndex(x => x === updatedRow.Status) > -1
													? ['True', 'Fasle']
															.findIndex(x => x === updatedRow.Status)
															.toString()
													: ''
											}
											label="Trạng thái"
											onChange={(e: SelectChangeEvent) =>
												setUpdatedRow({
													...updatedRow,
													Status: ['True', 'Fasle'][Number(e.target.value)],
												})
											}
										>
											{['True', 'Fasle'].map((x, idx) => (
												<MenuItem key={idx} value={idx}>
													{x}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								);
							} else if (column.id === 'Instructor' && registerGeneralData.length > 0) {
								return (
									<FormControl sx={{ m: 0, minWidth: 120 }} key={column.id}>
										<InputLabel id="employees-select-required-label">Đăng ký chung</InputLabel>
										<Select
											labelId="employees-select-required-label"
											id="employees-select-required"
											value={
												registerGeneralData.findIndex(x => x.RegisterGeneralId === updatedRow.RegisterGeneralId) > -1
													? registerGeneralData
															.findIndex(x => x.RegisterGeneralId === updatedRow.RegisterGeneralId)
															.toString()
													: ''
											}
											label="Đăng ký chung"
											onChange={(e: SelectChangeEvent) =>
												setUpdatedRow({
													...updatedRow,
													RegisterGeneralId: registerGeneralData[Number(e.target.value)],
												})
											}
										>
											{registerGeneralData.map((x, idx) => (
												<MenuItem key={idx} value={idx}>
													{`${x.RegisterGeneralId} - ${x.Instructor} - ${x.ResearchSubject}`}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								);
							} else if (column.id === 'ThesisName' || column.id === 'ResearchSubject') {
								return <></>;
							} else {
								return (
									<TextField
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.id && updatedRow[column.id]}
										onChange={debounce(
											e => setUpdatedRow({ ...updatedRow, [e.target.name]: e.target.value }),
											300,
										)}
									/>
								);
							}
						})}
					</Stack>
				</form>
			</DialogContent>
			<DialogActions sx={{ p: '1.25rem' }}>
				<Button onClick={onCloseEditModal}>Huỷ</Button>
				<Button color="primary" onClick={handleSubmit} variant="contained">
					Lưu thay đổi
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditLabModal;
