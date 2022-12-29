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
import { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { RootState } from '../../../store';
import { IExportType } from '../../../types/exportType';

type EditExportModalProps = {
	isEditModal: boolean;
	columns: MRT_ColumnDef<IExportType>[];
	onClose: () => void;
	handleSubmitEditModal: Function;
	initData: any;
};

const EditExportModal: FC<EditExportModalProps> = ({
	isEditModal,
	columns,
	onClose,
	handleSubmitEditModal,
	initData,
}: EditExportModalProps) => {
	const [updatedRow, setUpdatedRow] = useState<any>(() => initData);
	const laboratoriesData = useAppSelector((state: RootState) => state.laboratory.listOfLaboratories);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const registerGeneralData = useAppSelector((state: RootState) => state.registerGeneral.listOfRegisterGenerals);
	const studySessionData = useAppSelector((state: RootState) => state.schedule.listOfSchedules);
	const departmentData = useAppSelector((state: RootState) => state.department.listOfDepartments);
	const subjectData = useAppSelector((state: RootState) => state.subject.listOfSubjects);

	const handleSubmit = () => {
		handleSubmitEditModal(updatedRow);
		onClose();
	};

	useEffect(() => {
		setUpdatedRow(initData);
	}, [isEditModal, initData]);

	return (
		<Dialog open={isEditModal} PaperProps={{ style: { width: '800px', maxWidth: 'unset' } }}>
			<DialogTitle textAlign="center">
				<b>Sửa thông tin phiếu xuất</b>
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
							if ((column.id === 'ExportLabId' ||column.id === 'ExpRegGeneralId' ||column.id === 'ExpSubjectId' )  && column.enableHiding !== false) {
								return (
									<TextField
										disabled
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.id && updatedRow[column.id]}
									/>
								);
							} else if (column.id === 'formatedExportDate' && column.enableHiding !== false) {
								return (
									<LocalizationProvider dateAdapter={AdapterMoment} key={column.id}>
										<DatePicker
											label={column.header}
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
										defaultValue={list.find(x => x.id === updatedRow['SubjectId']) || null}
										value={list.find(x => x.id === updatedRow['SubjectId']) || null}
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
												SubjectId: value?.id,
											});
										}}
									/>
								);
							}else if (
								column.id === 'RegisterGeneralId' &&
								column.enableHiding !== false &&
								registerGeneralData.length > 0
							) {
								const list = registerGeneralData.map((x: any) => ({
									label: `${x.RegisterGeneralId} - ${x.Instructor} - ${x.ResearchSubject}`,
									id: x.RegisterGeneralId,
								}));

								return (
									<Autocomplete
										key={column.id}
										options={list}
										noOptionsText="Không có kết quả trùng khớp"
										defaultValue={list.find((x: any) => x.id === updatedRow['RegisterGeneralId']) || null}
										value={list.find((x: any) => x.id === updatedRow['RegisterGeneralId']) || null}
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
												RegisterGeneralId: value?.id,
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
										defaultValue={list.find(x => x.id === updatedRow['LabId']) || null}
										value={list.find(x => x.id === updatedRow['LabId']) || null}
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
												LabId: value?.id,
											});
										}}
									/>
								);
							} else if (
								(column.id === 'EmployeeId' || column.id === 'EmployeeInCharge' || column.id === 'EmployeeCreate') &&
								column.enableHiding !== false &&
								employeeData.length > 0
							) {
								const list = employeeData.map(x => ({
									label: `${x.EmployeeId} - ${x.Fullname}`,
									id: x.EmployeeId,
								}));

								return (
									<Autocomplete
										key={column.id}
										options={list}
										noOptionsText="Không có kết quả trùng khớp"
										defaultValue={list.find(x => x.id === updatedRow[column.id as keyof typeof updatedRow]) || null}
										value={list.find(x => x.id === updatedRow[column.id as keyof typeof updatedRow]) || null}
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
												[column.id as keyof typeof updatedRow]: value?.id,
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
										<InputLabel id="Accept-select-required-label">Chấp nhận</InputLabel>
										<Select
											labelId="Accept-select-required-label"
											id="Accept-select-required"
											value={
												statusList.findIndex(x => x === updatedRow.Accept) > -1
													? statusList
															.findIndex(x => x === updatedRow.Accept)
															.toString()
													: ''
											}
											label={column.header}
											onChange={(e: SelectChangeEvent) =>
												setUpdatedRow({
													...updatedRow,
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
								const list = [1, 2, 3];
								return (
									<FormControl sx={{ m: 0, minWidth: 120 }} key={column.id}>
										<InputLabel id="Semester-select-required-label">Học kỳ</InputLabel>
										<Select
											labelId="Semester-select-required-label"
											id="Semester-select-required"
											value={
												list.findIndex(x => x === updatedRow.Semester) > -1
													? list
															.findIndex(x => x === updatedRow.Semester)
															.toString()
													: ''
											}
											label={column.header}
											onChange={(e: SelectChangeEvent) =>
												setUpdatedRow({
													...updatedRow,
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
										disabled={!column?.enableEditing}
										noOptionsText="Không có kết quả trùng khớp"
										defaultValue={list.find(x => x.id === updatedRow['DepartmentId']) || null}
										value={list.find(x => x.id === updatedRow['DepartmentId']) || null}
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
												DepartmentId: value?.id,
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
									label: `${x.EmployeeId} - ${x.Fullname}`,
									id: x.EmployeeId,
								}));

								return (
									<Autocomplete
										key={column.id}
										options={list}
										noOptionsText="Không có kết quả trùng khớp"
										defaultValue={list.find(x => x.id === updatedRow['UserAccept']) || null}
										value={list.find(x => x.id === updatedRow['UserAccept']) || null}
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
												UserAccept: value?.id,
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
										options={list}
										noOptionsText="Không có kết quả trùng khớp"
										defaultValue={list.find(x => x.id === updatedRow['SessionId']) || null}
										value={list.find(x => x.id === updatedRow['SessionId']) || null}
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
												SessionId: value?.id,
											});
										}}
									/>
								);
							} else if (
								column.id === 'Note' &&
								column.enableHiding !== false &&
								registerGeneralData.length > 0
							) {
								return (
									<TextField
										key={column.accessorKey}
										label={column.header}
										name={column.accessorKey}
										defaultValue={column.id && updatedRow[column.id]}
										multiline={true}
										minRows={3}
										maxRows={5}
										onChange={debounce(
											e => setUpdatedRow({ ...updatedRow, [e.target.name]: e.target.value }),
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
				<Button onClick={onClose}>Hủy</Button>
				<Button color="primary" onClick={handleSubmit} variant="contained">
					Tiếp theo
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditExportModal;
