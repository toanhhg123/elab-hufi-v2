import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
	Avatar,
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { Genders } from '../configs/enums';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setListOfEmployees } from '../layouts/EmployeeTable/employeeSlice';
import { getDepartments } from '../services/departmentServices';
import { getEmployeeById, updateEmployee } from '../services/employeeServices';
import { RootState } from '../store';
import { dummyDepartmentData, IDepartmentType } from '../types/departmentType';
import { dummyEmployeeData, IEmployeeType } from '../types/employeeType';
import { setSnackbarMessage } from './appSlice';
import './Dashboard.css';

const Account: React.FC = () => {
	const [createdRow, setCreatedRow] = useState<any>(dummyEmployeeData);
	const [employee, setEmployee] = useState<any>(dummyEmployeeData);
	const [isChanged, setIsChanged] = useState<Boolean>(false);
	const employeeData = useAppSelector((state: RootState) => state.employee.listOfEmployees);
	const [departments, setDeparments] = useState<IDepartmentType[]>([dummyDepartmentData]);
	const [avatarUpload, setAvatarUpload] = useState<string>();

	const dispatch = useAppDispatch();

	const columns = useMemo<MRT_ColumnDef<IEmployeeType>[]>(
		() => [
			{
				accessorKey: 'Fullname',
				header: 'Họ và tên',
				size: 100,
			},
			{
				accessorKey: 'formatedBirthday',
				header: 'Ngày sinh',
				size: 140,
			},
			{
				accessorKey: 'Gender',
				header: 'Giới tính',
				size: 140,
			},
			{
				accessorKey: 'Address',
				header: 'Địa chỉ',
				size: 140,
			},
			{
				accessorKey: 'Email',
				header: 'Email',
				size: 140,
			},
			{
				accessorKey: 'PhoneNumber',
				header: 'Số điện thoại',
				size: 50,
			},
			{
				accessorKey: 'DepartmentName',
				header: 'Phòng ban',
				size: 50,
			},
		],
		[],
	);

	const compareTwoObj = () => {
		const keys: string[] = Object.keys(employee);
		for (let i = 0; i < keys.length; i++) {
			if (employee[keys[i]] !== createdRow[keys[i]]) {
				setIsChanged(true);
				return;
			}
		}
		setIsChanged(false);
	};

	useEffect(() => {
		async function getEmployee(id: String) {
			try {
				let emp: IEmployeeType = await getEmployeeById('01001221');
				setEmployee(emp);
				setCreatedRow(emp);
			} catch (error) {}
		}

		async function getDepartmentList() {
			try {
				let departments: IDepartmentType[] = await getDepartments();
				setDeparments(departments);
			} catch (error) {}
		}

		getEmployee('01001221');
		getDepartmentList();
	}, []);

	useEffect(() => {
		compareTwoObj();
	}, [createdRow, employee]);

	const handleSubmitEdit = async () => {
		const isUpdatedSuccess = await updateEmployee({
			EmployeeId: createdRow.EmployeeId + 1,
			Fullname: createdRow.Fullname,
			Birthday: createdRow.Birthday,
			Gender: createdRow.Gender,
			Address: createdRow.Address,
			Email: createdRow.Email,
			PhoneNumber: createdRow.PhoneNumber,
			DepartmentId: createdRow.DepartmentId,
		});

		if (Object.keys(isUpdatedSuccess).length !== 0) {
			dispatch(setSnackbarMessage('Cập nhật thông tin nhân viên thành công'));
			let updatedIdx = employeeData.findIndex(x => x.EmployeeId === createdRow.EmployeeId);
			let newListOfEmployees = [
				...employeeData.slice(0, updatedIdx),
				createdRow,
				...employeeData.slice(updatedIdx + 1),
			];
			setEmployee(createdRow);
			setCreatedRow(createdRow);
			dispatch(setListOfEmployees(newListOfEmployees));
		} else {
			setEmployee(employee)
			setCreatedRow(employee)
			dispatch(setSnackbarMessage('Cập nhật thông tin nhân viên không thành công'));
		}
	};

	return (
		<div className="home">
			<h3 style={{ margin: '0px', textAlign: 'left', padding: '8px' }}>
				<b>
					<KeyboardArrowRightIcon
						style={{ margin: '0px', fontSize: '30px', paddingTop: '15px' }}
					></KeyboardArrowRightIcon>
				</b>
				<span>Thông tin nhân viên</span>
				<Grid container>
					<Grid item xs={12} md={10} lg={9} sx={{ margin: 'auto' }}>
						<form onSubmit={e => e.preventDefault()} style={{ margin: '10px 0 56px 0' }}>
							<Stack
								sx={{
									width: '100%',
									minWidth: { xs: '300px', sm: '360px', md: '400px' },
									gap: '1.5rem',
								}}
							>
								<Box sx={{ position: 'relative', display: 'inline-block', margin: 'auto' }}>
									<Avatar
										alt={createdRow.Fullname}
										src={avatarUpload || '/static/images/avatar/1.jpg'}
										sx={{ width: 120, height: 120 }}
									/>
									<Button
										variant="contained"
										color="primary"
										component="label"
										sx={{
											position: 'absolute',
											bottom: '0px',
											right: '16px',
											borderRadius: '50%',
											width: '30px',
											height: '30px',
											fontSize: '1rem',
											padding: '0',
											minWidth: 'unset',
										}}
									>
										<EditIcon fontSize="small"></EditIcon>
										<input
											type="file"
											name="avatar"
											hidden
											onChange={(e: any) => {
												const urlPreview = URL.createObjectURL(e.target.files[0]);
												console.log(urlPreview);
												setAvatarUpload(urlPreview);
											}}
										/>
									</Button>
								</Box>
								{createdRow.EmployeeId && (
									<Typography variant="body1" align="center">
										ID: <b>{createdRow.EmployeeId}</b>
									</Typography>
								)}
								<Grid container spacing={4}>
									{columns.map(column => {
										if (column.accessorKey === 'formatedBirthday') {
											return (
												<Grid item xs={12} sm={12} md={6} key={column.accessorKey}>
													<LocalizationProvider dateAdapter={AdapterMoment}>
														<DatePicker
															label="Ngày sinh"
															value={new Date(createdRow.Birthday * 1000)}
															onChange={(val: any) =>
																setCreatedRow({
																	...createdRow,
																	formatedBirthday: moment
																		.unix(Date.parse(val) / 1000)
																		.format('DD/MM/YYYY'),
																	Birthday: Date.parse(val) / 1000,
																})
															}
															renderInput={(params: any) => (
																<TextField sx={{ width: '100%' }} {...params} />
															)}
															inputFormat="DD/MM/YYYY"
														/>
													</LocalizationProvider>
												</Grid>
											);
										} else if (column.accessorKey === 'Gender') {
											return (
												<Grid item xs={12} sm={12} md={6} key={column.accessorKey}>
													<FormControl sx={{ m: 0, minWidth: 120, width: '100%' }}>
														<InputLabel id="edit-select-required">Giới tính</InputLabel>
														<Select
															labelId="edit-select-required"
															id="edit-select-required"
															value={Genders[createdRow.Gender]}
															label="Giới tính"
															sx={{ width: '100%' }}
															onChange={(e: SelectChangeEvent) =>
																setCreatedRow({
																	...createdRow,
																	Gender: Genders[Number(e.target.value)],
																})
															}
														>
															{Object.values(Genders)
																.slice(0, (Object.values(Genders).length + 1) / 2)
																.map((x, idx) => (
																	<MenuItem value={idx} key={idx}>
																		{x}
																	</MenuItem>
																))}
														</Select>
													</FormControl>
												</Grid>
											);
										} else if (column.accessorKey === 'DepartmentName' && departments.length > 0) {
											const departmentOptions: string[] = departments.map(x =>
												x.DepartmentName.toString(),
											);

											return (
												<Grid item xs={12} sm={12} md={6} key={column.accessorKey}>
													<FormControl sx={{ m: 0, minWidth: 120, width: '100%' }}>
														<InputLabel id="department-select-required-label">
															Phòng ban
														</InputLabel>
														<Select
															labelId="department-select-required-label"
															id="department-select-required"
															value={
																departments.findIndex(
																	x => x.DepartmentId === createdRow.DepartmentId,
																) > -1
																	? departments
																			.findIndex(
																				x =>
																					x.DepartmentId ===
																					createdRow.DepartmentId,
																			)
																			.toString()
																	: ''
															}
															label="Phòng ban"
															onChange={(e: SelectChangeEvent) =>
																setCreatedRow({
																	...createdRow,
																	DepartmentName:
																		departments[Number(e.target.value)]
																			.DepartmentName,
																	DepartmentId:
																		departments[Number(e.target.value)]
																			.DepartmentId,
																})
															}
														>
															{departmentOptions.map((x, idx) => (
																<MenuItem value={idx} key={idx}>
																	{x}
																</MenuItem>
															))}
														</Select>
													</FormControl>
												</Grid>
											);
										} else {
											return (
												<Grid item xs={12} sm={12} md={6} key={column.accessorKey}>
													<TextField
														label={column.header}
														name={column.accessorKey}
														value={column.accessorKey && createdRow[column.accessorKey]}
														onChange={e =>
															setCreatedRow({
																...createdRow,
																[e.target.name]: e.target.value,
															})
														}
														fullWidth
													/>
												</Grid>
											);
										}
									})}
								</Grid>
							</Stack>

							{isChanged && (
								<Box sx={{ textAlign: 'right', marginTop: '24px' }}>
									<Button onClick={() => setCreatedRow(employee)}>Hủy</Button>
									<Button color="primary" variant="contained" onClick={handleSubmitEdit}>
										Lưu thay đổi
									</Button>
								</Box>
							)}
						</form>
					</Grid>
				</Grid>
			</h3>
		</div>
	);
};

export default Account;
