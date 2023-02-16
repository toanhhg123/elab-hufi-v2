import {
	Button,
	FormControl, InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField
} from '@mui/material';
import SHA256 from 'crypto-js/sha256';
import { ChangeEvent, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import About from '../assets/img/login-about.png';
import HufiLogoExtended from '../assets/img/logo-hufi-extended.png';
import { saveToLocalStorage } from '../configs/apiHelper';
import { useAppDispatch } from '../hooks';
import { setOwner } from '../layouts/UserManager/userManagerSlice';
import { getEmployeeOwner } from '../services/employeeServices';
import { login } from '../services/userManagerServices';
import { dummyLoginData, IloginType } from '../types/loginType';
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
				getEmployeeOwnerData();
				navigate('/');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getEmployeeOwnerData = async () => {
		try {
			const owner = await getEmployeeOwner();
			if (owner) {
				dispatch(setOwner(owner));
			}
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
							<InputLabel id="account-type-label">Loại tài khoản</InputLabel>
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
