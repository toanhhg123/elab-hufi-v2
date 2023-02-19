import {
	Button,
	FormControl, InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField
} from '@mui/material';
import SHA256 from 'crypto-js/sha256';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import About from '../assets/img/login-about.png';
import HufiLogoExtended from '../assets/img/logo-hufi-extended.png';
import { saveToLocalStorage } from '../configs/apiHelper';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setIsLogined, setOwner, setToken } from '../layouts/UserManager/userManagerSlice';
import { getEmployeeOwner } from '../services/employeeServices';
import { getResearcherOwner } from '../services/researcherServices';
import { getStudentOwner } from '../services/studentServices';
import { login } from '../services/userManagerServices';
import { dummyLoginData, IloginType } from '../types/loginType';
import { dummyUserOwner, IUserOwner } from '../types/userManagerType';
import './Login.css';

const accountTypes = [
	{
		value: 'employee',
		label: 'Nhân viên',
	},
	{
		value: 'student',
		label: 'Sinh viên',
	},
	{
		value: 'researcher',
		label: 'Nghiên cứu sinh',
	},
];

export const Login: FC = () => {
	const [loginData, setLoginData] = useState<IloginType>(dummyLoginData);
	const isLogined = useAppSelector(state => state.userManager.isLogined)
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleChange = (prop: keyof IloginType) => (event: ChangeEvent<HTMLInputElement>) => {
		setLoginData({ ...loginData, [prop]: event.target.value });
	};
	
	const handleLogin = async () => {
		try {
			const res = await login(loginData.type, loginData.username, SHA256(`${loginData.password}`).toString());
			if (res) {
				saveToLocalStorage('user', { ...res, type: loginData.type });
				dispatch(setToken({ ...res, type: loginData.type }));
				dispatch(setIsLogined(true));
				getOwnerData();
				navigate('/');
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (isLogined === true) 
			navigate('/');
	}, [isLogined])

	const getOwnerData = async () => {
		try {
			let owner: IUserOwner = dummyUserOwner;
			switch (loginData.type) {
				case 'employee': {
					owner = await getEmployeeOwner();
					break;
				}
				case 'student': {
					owner = await getStudentOwner(loginData.username);
					break;
				}
				case 'researcher': {
					owner = await getResearcherOwner(loginData.username);
					break;
				}
			}
			dispatch(setOwner(owner));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="login-container">
			<div className="login-about">
				<h2>HỆ THỐNG QUẢN LÝ PHÒNG THÍ NGHIỆM ELAB</h2>
				<img src={About} style={{ height: '480px', opacity: '80%' }} alt="" />
			</div>

			<div className="login-form">
				<img src={HufiLogoExtended} style={{ width: '340px' }} alt="" />
				<h2>ĐĂNG NHẬP HỆ THỐNG</h2>

				<form onSubmit={e => e.preventDefault()} style={{ margin: '30px 30px' }}>
					<Stack sx={{ width: '100%', gap: '1.5rem' }}>
						<FormControl variant="outlined" sx={{ minWidth: 120 }}>
							<InputLabel id="account-type-label">Đối tượng</InputLabel>
							<Select
								labelId="account-type-label"
								id="account-type"
								value={loginData.type}
								onChange={e => setLoginData(prev => ({ ...prev, type: `${e.target.value}` }))}
								label="Loại tài khoản"
								sx={{ textAlign: 'left' }}
							>
								{accountTypes.map(type => (
									<MenuItem key={type.value} value={type.value}>
										{type.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							label="Nhập tên đăng nhập"
							value={loginData.username}
							onChange={handleChange('username')}
							variant="outlined"
						/>
						<TextField
							type="password"
							label="Nhập mật khẩu"
							value={loginData.password}
							onChange={handleChange('password')}
							variant="outlined"
						/>
					</Stack>
				</form>

				<div style={{ textDecoration: 'none' }}>
					<Button onClick={handleLogin} variant="contained">
						Đăng nhập
					</Button>
				</div>
			</div>
		</div>
	);
};
