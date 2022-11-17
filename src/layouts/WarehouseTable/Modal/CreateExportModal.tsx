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
	SelectChangeEvent, TextField
} from '@mui/material';
import { Stack } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import { useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { dummyExportData, IExportType } from '../../../types/exportType';

type CreateExportModalProps = {
	isCreateModal: boolean;
	columns: MRT_ColumnDef<IExportType>[];
	onClose: () => void;
	handleSubmitCreateModal: Function;
};

const CreateExportModal = ({ isCreateModal, columns, onClose, handleSubmitCreateModal }: CreateExportModalProps) => {
	const [createdRow, setCreatedRow] = useState<any>(dummyExportData);
	const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const registerGeneralData = useAppSelector((state: RootState) => state.registerGeneral.listOfRegisterGeneral);
	const subjectData = useAppSelector((state: RootState) => state.subject.listOfSubjects);
	const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);

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
								(column.id === 'EmployeeId' || column.id === 'EmployeeInCharge' || column.id === 'EmployeeCreate') &&
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
										defaultValue={list.find(x => x.id === createdRow[column.id as keyof typeof createdRow]) || null}
										value={list.find(x => x.id === createdRow[column.id as keyof typeof createdRow]) || null}
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
											setCreatedRow({
												...createdRow,
												[column.id as keyof typeof createdRow]: value?.id,
											});
										}}
									/>
								);
							} else if (
								column.id === 'SubjectId' &&
								column.enableHiding !== false &&
								employeeData.length > 0
							) {
								const list =  Array.isArray(subjectData) ?  subjectData?.map(x => ({
									label: `${x.SubjectId} - ${x.SubjectName}`,
									id: x.SubjectId,
								})) : [];

								return (
									<Autocomplete
										key={column.id}
										options={list}
										noOptionsText="Không có kết quả trùng khớp"
										defaultValue={list.find(x => x.id === createdRow['SubjectId']) || null}
										value={list.find(x => x.id === createdRow['SubjectId']) || null}
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
												SubjectId: value?.id,
											});
										}}
									/>
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
								column.id === 'UserAccept' &&
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
										defaultValue={list.find(x => x.id === createdRow['UserAccept']) || null}
										value={list.find(x => x.id === createdRow['UserAccept']) || null}
										getOptionLabel={option => option?.label}
										renderInput={params => {
											return (
												<TextField
													{...params}
													label="Người chấp nhận"
													placeholder="Nhập để tìm kiếm"
												/>
											);
										}}
										onChange={(event, value) => {
											setCreatedRow({
												...createdRow,
												UserAccept: value?.id,
											});
										}}
									/>
								);
							} else if (
								column.id === 'DepartmentId' &&
								column.enableHiding !== false &&
								employeeData.length > 0
							) {
								const list = departmentData.map(x => ({
									label: `${x.DepartmentId} - ${x.DepartmentName}`,
									id: x.DepartmentId,
								}));

								return (
									<Autocomplete
										key={column.id}
										options={list}
										noOptionsText="Không có kết quả trùng khớp"
										defaultValue={list.find(x => x.id === createdRow['DepartmentId']) || null}
										value={list.find(x => x.id === createdRow['DepartmentId']) || null}
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
											setCreatedRow({
												...createdRow,
												DepartmentId: value?.id,
											});
										}}
									/>
								);
							} else if (
								column.id === 'Accept' &&
								column.enableHiding !== false &&
								employeeData.length > 0
							) {
								const statusList = ['Accepted', 'Pending'];
								return (
									<FormControl sx={{ m: 0, minWidth: 120 }} key={column.id}>
										<InputLabel id="Accept-select-required-label">{column.header}</InputLabel>
										<Select
											labelId="Accept-select-required-label"
											id="Accept-select-required"
											value={
												statusList.findIndex(x => x === createdRow.Accept) > -1
													? statusList.findIndex(x => x === createdRow.Accept).toString()
													: ''
											}
											label={column.header}
											onChange={(e: SelectChangeEvent) =>
												setCreatedRow({
													...createdRow,
													Accept: statusList[Number(e.target.value)],
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
								column.id === 'Semester' &&
								column.enableHiding !== false &&
								employeeData.length > 0
							) {
								const list = ['1', '2', '3'];
								return (
									<FormControl sx={{ m: 0, minWidth: 120 }} key={column.id}>
										<InputLabel id="Semester-select-required-label">{column.header}</InputLabel>
										<Select
											labelId="Semester-select-required-label"
											id="Semester-select-required"
											value={
												list.findIndex(x => x === createdRow.Semester) > -1
													? list.findIndex(x => x === createdRow.Semester).toString()
													: ''
											}
											label={column.header}
											onChange={(e: SelectChangeEvent) =>
												setCreatedRow({
													...createdRow,
													Semester: list[Number(e.target.value)],
												})
											}
										>
											{list.map((x, idx) => (
												<MenuItem key={idx} value={idx}>
													{x}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								);
							}else if (
								column.id === 'Note' &&
								column.enableHiding !== false &&
								registerGeneralData.length > 0
							) {
								return (
									<TextField
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.id && createdRow[column.id]}
										multiline={true}
										minRows={3}
										maxRows={5}
										onChange={debounce(
											e => setCreatedRow({ ...createdRow, [e.target.name]: e.target.value }),
											300,
										)}
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
					Tiếp theo
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateExportModal;
