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
import { IWarehouseType } from '../../../types/warehouseType';

type EditExportModalProps = {
	isEditModal: boolean;
	columns: MRT_ColumnDef<IWarehouseType>[];
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
	const registerGeneralData = useAppSelector((state: RootState) => state.registerGeneral.listOfRegisterGeneral);
	const studySessionData = useAppSelector((state: RootState) => state.schedule.listOfSchedules);

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
							if (column.id === 'ExportId' && column.enableHiding !== false) {
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
											label="Ngày xuất"
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
													label="Phòng thí nghiệm"
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
										defaultValue={list.find(x => x.id === updatedRow['EmployeeId']) || null}
										value={list.find(x => x.id === updatedRow['EmployeeId']) || null}
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
											setUpdatedRow({
												...updatedRow,
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
										defaultValue={list.find(x => x.id === updatedRow['RegisterGeneralId']) || null}
										value={list.find(x => x.id === updatedRow['RegisterGeneralId']) || null}
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
											setUpdatedRow({
												...updatedRow,
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
										options={list}
										noOptionsText="Không có kết quả trùng khớp"
										defaultValue={list.find(x => x.id === updatedRow['SessionId']) || null}
										value={list.find(x => x.id === updatedRow['SessionId']) || null}
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
											setUpdatedRow({
												...updatedRow,
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
				<Button onClick={onClose}>Huỷ</Button>
				<Button color="primary" onClick={handleSubmit} variant="contained">
					Lưu thay đổi
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default EditExportModal;
