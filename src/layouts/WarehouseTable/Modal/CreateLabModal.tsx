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
import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { dummyWarehouseData, IWarehouseType } from '../../../types/warehouseType';

type CreateLabModalProps = {
	isCreateModal: boolean;
	columns: MRT_ColumnDef<IWarehouseType>[];
	onCloseCreateModal: React.MouseEventHandler;
	handleSubmitCreateModal: Function;
};

const CreateLabModal = ({
	isCreateModal,
	columns,
	onCloseCreateModal,
	handleSubmitCreateModal,
}: CreateLabModalProps) => {
	const [createdRow, setCreatedRow] = useState<any>(dummyWarehouseData);
	const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const registerGeneralData = useAppSelector((state: RootState) => state.registerGeneral.listOfRegisterGeneral);

	const handleSubmit = () => {
		handleSubmitCreateModal(createdRow);
	};

	return (
		<Dialog open={isCreateModal}>
			<DialogTitle textAlign="center">
				<b>Tạo thông tin Lab mới</b>
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
							if (column.id === 'formatedExportDate') {
								return (
									<LocalizationProvider dateAdapter={AdapterMoment} key={column.id}>
										<DatePicker
											label="Ngày xuất"
											value={new Date(createdRow.ExportDate)}
											onChange={(val: any) =>
												setCreatedRow({
													...createdRow,
													formatedExportDate: moment
														.unix(Date.parse(val) / 1000)
														.format('DD/MM/YYYY'),
													ExportDate: Date.parse(val),
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
												laboratoriesData.findIndex(x => x.LabId === createdRow.LabId) > -1
													? laboratoriesData
															.findIndex(x => x.LabId === createdRow.LabId)
															.toString()
													: ''
											}
											label="Phòng thí nghiệm"
											onChange={(e: SelectChangeEvent) =>
												setCreatedRow({
													...createdRow,
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
												employeeData.findIndex(x => x.EmployeeID === createdRow.EmployeeId) > -1
													? employeeData
															.findIndex(x => x.EmployeeID === createdRow.EmployeeId)
															.toString()
													: ''
											}
											label="Người xuất"
											onChange={(e: SelectChangeEvent) =>
												setCreatedRow({
													...createdRow,
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
										<InputLabel id="employees-select-required-label">Trạng thái</InputLabel>
										<Select
											labelId="employees-select-required-label"
											id="employees-select-required"
											value={
												['True', 'Fasle'].findIndex(x => x === createdRow.Status) > -1
													? ['True', 'Fasle']
															.findIndex(x => x === createdRow.Status)
															.toString()
													: ''
											}
											label="Trạng thái"
											onChange={(e: SelectChangeEvent) =>
												setCreatedRow({
													...createdRow,
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
							} else if(column.id === 'Instructor' && registerGeneralData.length >0) {
								return (
									<FormControl sx={{ m: 0, minWidth: 120 }} key={column.id}>
										<InputLabel id="employees-select-required-label">Đăng ký chung</InputLabel>
										<Select
											labelId="employees-select-required-label"
											id="employees-select-required"
											value={
												registerGeneralData.findIndex(x => x.RegisterGeneralId === createdRow.RegisterGeneralId) > -1
													? registerGeneralData
															.findIndex(x => x.RegisterGeneralId === createdRow.RegisterGeneralId)
															.toString()
													: ''
											}
											label="Đăng ký chung"
											onChange={(e: SelectChangeEvent) =>
												setCreatedRow({
													...createdRow,
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
							} else if(column.id === 'ThesisName' || column.id === 'ResearchSubject') {
								return <></>
							}
							else {
								return (
									<TextField
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.id && createdRow[column.id]}
										onChange={debounce(
											e => setCreatedRow({ ...createdRow, [e.target.name]: e.target.value }),
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
				<Button onClick={onCloseCreateModal}>Huỷ</Button>
				<Button color="primary" onClick={handleSubmit} variant="contained">
					Tạo
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateLabModal;
