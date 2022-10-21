import {
	Autocomplete,
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
import { useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { dummyWarehouseData, IWarehouseType } from '../../../types/warehouseType';

type CreateExportModalProps = {
	isCreateModal: boolean;
	columns: MRT_ColumnDef<IWarehouseType>[];
	onClose: () => void;
	handleSubmitCreateModal: Function;
};

const CreateExportModal = ({ isCreateModal, columns, onClose, handleSubmitCreateModal }: CreateExportModalProps) => {
	const [createdRow, setCreatedRow] = useState<any>(dummyWarehouseData);
	const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const registerGeneralData = useAppSelector((state: RootState) => state.registerGeneral.listOfRegisterGeneral);
	const studySessionData = useAppSelector((state: RootState) => state.schedule.listOfSchedules);

	const handleSubmit = () => {
		handleSubmitCreateModal(createdRow);
		onClose();
	};

	return (
		<Dialog open={isCreateModal}>
			<DialogTitle textAlign="center">
				<b>Tạo thông tin phiếu xuất mới</b>
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
							if (column.id === 'formatedExportDate' && column.enableHiding !== false) {
								return (
									<LocalizationProvider dateAdapter={AdapterMoment} key={column.id}>
										<DatePicker
											label="Ngày xuất"
											value={new Date(createdRow.ExportDate * 1000)}
											onChange={(val: any) =>
												setCreatedRow({
													...createdRow,
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
							} else if (
								column.id === 'LabId' &&
								column.enableHiding !== false &&
								laboratoriesData.length > 0
							) {
								const list = laboratoriesData.map(x => ({
									label: `${x.LabName} - ${x.Location}`,
									id: x.LabId,
								}));

								return (
									<Autocomplete
										key={column.id}
										options={list}
										noOptionsText="Không có kết quả trùng khớp"
										defaultValue={list.find(x => x.id === createdRow['LabId']) || null}
										value={list.find(x => x.id === createdRow['LabId']) || null}
										getOptionLabel={option => option?.label}
										renderInput={params => {
											return (
												<TextField
													{...params}
													label="Phòng thí nghiệm"
													placeholder="Nhập để tìm kiếm"
												/>
											);
										}}
										onChange={(event, value) => {
											setCreatedRow({
												...createdRow,
												LabId: value?.id,
											});
										}}
									/>
								);
							} else if (
								column.id === 'EmployeeId' &&
								column.enableHiding !== false &&
								employeeData.length > 0
							) {
								const list = employeeData.map(x => ({
									label: `${x.EmployeeID} - ${x.Fullname}`,
									id: x.EmployeeID,
								}));

								return (
									<Autocomplete
										key={column.id}
										options={list}
										noOptionsText="Không có kết quả trùng khớp"
										defaultValue={list.find(x => x.id === createdRow['EmployeeId']) || null}
										value={list.find(x => x.id === createdRow['EmployeeId']) || null}
										getOptionLabel={option => option?.label}
										renderInput={params => {
											return (
												<TextField
													{...params}
													label="Người xuất"
													placeholder="Nhập để tìm kiếm"
												/>
											);
										}}
										onChange={(event, value) => {
											setCreatedRow({
												...createdRow,
												EmployeeId: value?.id,
											});
										}}
									/>
								);
							} else if (
								column.id === 'Status' &&
								column.enableHiding !== false &&
								employeeData.length > 0
							) {
								const statusList = ['True', 'Fasle']
								return (
									<FormControl sx={{ m: 0, minWidth: 120 }} key={column.id}>
										<InputLabel id="status-select-required-label">Trạng thái</InputLabel>
										<Select
											labelId="status-select-required-label"
											id="status-select-required"
											value={
												statusList.findIndex(x => x === createdRow.Status) > -1
													? 
													statusList.findIndex(x => x === createdRow.Status)
															.toString()
													: ''
											}
											label="Trạng thái"
											onChange={(e: SelectChangeEvent) =>
												setCreatedRow({
													...createdRow,
													Status: statusList[Number(e.target.value)],
												})
											}
										>
											{statusList.map((x, idx) => (
												<MenuItem key={idx} value={idx}>
													{x}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								);
							} else if (
								column.id === 'RegisterGeneralId' &&
								column.enableHiding !== false &&
								registerGeneralData.length > 0
							) {

								const list = registerGeneralData.map((x, idx) => ({
									label: `${x.RegisterGeneralId} - ${x.Instructor} - ${x.ResearchSubject}`,
									id: x.RegisterGeneralId,
								}));

								return (
									<Autocomplete
										key={column.id}
										options={list}
										noOptionsText="Không có kết quả trùng khớp"
										defaultValue={list.find(x => x.id === createdRow['RegisterGeneralId']) || null}
										value={list.find(x => x.id === createdRow['RegisterGeneralId']) || null}
										getOptionLabel={option => option?.label}
										renderInput={params => {
											return (
												<TextField
													{...params}
													label="Đăng kí chung"
													placeholder="Nhập để tìm kiếm"
												/>
											);
										}}
										onChange={(event, value) => {
											setCreatedRow({
												...createdRow,
												RegisterGeneralId: value?.id,
											});
										}}
									/>
								);
							} else if (
								column.id === 'SessionId' &&
								column.enableHiding !== false &&
								registerGeneralData.length > 0
							) {
								const list = studySessionData.map((x, idx) => ({
									label: `${x.ClassName} - ${x.TeacherName?.replace('-', ' ')} - Thứ ${
										x.DayOfWeek
									} - Tiết ${x.StartTime}->${x.EndTime} - ${moment
										.unix(Number(x.DateStudy) || 0)
										.format('DD/MM/YYYY')} - Môn ${x.SubjectName} - ${x.LessonName}`,
									id: x.SessionId,
								}));

								return (
									<Autocomplete
										key={column.id}
										noOptionsText="Không có kết quả trùng khớp"
										options={list}
										defaultValue={list.find(x => x.id === createdRow['SessionId']) || null}
										value={list.find(x => x.id === createdRow['SessionId']) || null}
										getOptionLabel={option => option?.label}
										renderInput={params => {
											return (
												<TextField
													{...params}
													label="Buổi học"
													placeholder="Nhập để tìm kiếm"
												/>
											);
										}}
										onChange={(event, value) => {
											setCreatedRow({
												...createdRow,
												SessionId: value?.id,
											});
										}}
									/>
								);
							} else if (column.enableHiding === false) {
								return null;
							} else {
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
				<Button onClick={onClose}>Huỷ</Button>
				<Button color="primary" onClick={handleSubmit} variant="contained">
					Tạo
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateExportModal;
