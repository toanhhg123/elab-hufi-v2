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
import { connect } from 'react-redux';
import { Genders } from '../configs/enums';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setListOfEmployees } from '../layouts/EmployeeTable/employeeSlice';
import { getDepartments } from '../services/departmentServices';
import { getEmployeeById, updateEmployee } from '../services/employeeServices';
import { RootState } from '../store';
import { dummyDepartmentData, IDepartmentType } from '../types/departmentType';
import { dummyUserOwner, IUserOwner } from '../types/userManagerType';
import { setSnackbarMessage } from './appSlice';
import './Dashboard.css';

const Account: React.FC = () => {
	const owner = useAppSelector(state => state.userManager.owner);
	const [avatarUpload, setAvatarUpload] = useState<string>();
	console.log(owner);
	const columns: any = useMemo<MRT_ColumnDef<any>[]>(() => {
			return [
				{
					accessorKey: 'UserName',
					header: 'ID',
					size: 100,
				},
				{
					accessorKey: 'FullName',
					header: 'Tên',
					size: 140,
				},
				{
					accessorKey: 'DepartmentName',
					header: 'Phòng/Khoa',
					size: 140,
				},
				{
					accessorKey: 'GroupName',
					header: 'Nhóm',
					size: 140,
				},
			]
		}
	, [owner]);

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
										alt={owner?.Fullname?.toString()}
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
								<Grid container spacing={4}>
									{columns.map((column: any) => {
										return (
											<Grid item xs={12} sm={12} md={6} key={column.accessorKey}>
												<TextField
													label={column.header}
													name={column.accessorKey}
													value={
														column.accessorKey &&
														owner[column.accessorKey as keyof typeof owner]
													}
													fullWidth
													variant="standard"
												/>
											</Grid>
										)
									})}
								</Grid>
							</Stack>
						</form>
					</Grid>
				</Grid>
			</h3>
		</div>
	);
};

export default Account;