import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import SHA256 from 'crypto-js/sha256'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import About from '../assets/img/login-about.png'
import HufiLogoExtended from '../assets/img/logo-hufi-extended.png'
import { saveToLocalStorage } from '../configs/apiHelper'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setIsLogined, setOwner } from '../layouts/UserManager/userManagerSlice'
import { getEmployeeOwner } from '../services/employeeServices'
import { getResearcherOwner } from '../services/researcherServices'
import { getStudentOwner } from '../services/studentServices'
import { login } from '../services/userManagerServices'
import { dummyLoginData, IloginType } from '../types/loginType'
import { dummyUserOwner, isUserOwner, IUserOwner } from '../types/userManagerType'
import './Login.css'
   
export const Login: FC = () => {
	const [loginData, setLoginData] = useState<IloginType>(dummyLoginData)
	const isLogined = useAppSelector(state => state.userManager.isLogined)
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const handleChange = (prop: keyof IloginType) => (event: ChangeEvent<HTMLInputElement>) => {
		setLoginData({ ...loginData, [prop]: event.target.value })
	}
	const handleLogin = async () => {
		try {
			const res = await login(loginData.type, loginData.username, SHA256(`${loginData.password}`).toString())
			if (Object.entries(res?.data).length !== 0 && isUserOwner(res?.data)) {
				saveToLocalStorage('user', { ...res.data, type: loginData.type })
				dispatch(setOwner(res.data))
				dispatch(setIsLogined(true))
				navigate('/')
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		if (isLogined === true) navigate('/')
	}, [isLogined])

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
	)
}
