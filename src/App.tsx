import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { Box } from '@mui/system';
import 'devextreme/dist/css/dx.light.css';
import React, { useEffect } from 'react';
import { Link, redirect, Route, Routes, useNavigate } from 'react-router-dom';
import AppBar from '../src/components/Appbar';
import './App.css';
import DrawerLeft from './components/DrawerLeft';
import Footer from './components/Footer';
import { clearFromLocalStorage, getFromLocalStorage } from './configs/apiHelper';
import { useAppDispatch, useAppSelector } from './hooks';
import { logout, setIsLogined, setOwner } from './layouts/UserManager/userManagerSlice';
import Account from './pages/Account';
import { setIsOpenDrawer } from './pages/appSlice';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import Logout from './pages/Logout';
import { NotFound } from './pages/NotFound';
import { getEmployeeOwner } from './services/employeeServices';
import { getLaboratories } from './services/laboratoryServices';
import { getResearcherOwner } from './services/researcherServices';
import { getStudentOwner } from './services/studentServices';
import { RootState } from './store';
import { dummyUserOwner, IUserOwner } from './types/userManagerType';

const settings = [
	{
		text: 'Tài khoản',
		link: '/account',
	},
	{
		text: 'Đăng xuất',
		link: '/logout',
	},
];

function App() {
	const isOpenDrawer: boolean = useAppSelector((state: RootState) => state.app.isOpenDrawer);
	const isLogined = useAppSelector((state: RootState) => state.userManager.isLogined);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

	const handleDrawerOpen = () => {
		dispatch(setIsOpenDrawer(true));
	};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	useEffect(() => {
		getLaboratories();
	}, []);

	useEffect(() => {
		const getUserLocal = async () => {
			const user = await getFromLocalStorage('user');
			if (user) {
				dispatch(setOwner(user));
				dispatch(setIsLogined(true));
				navigate('/');
				
			} else {
				dispatch(logout());
				dispatch(setIsLogined(false));
				navigate('/login');
			}
		};
		getUserLocal();
	}, [isLogined]);
	

	const _renderRouteElement = (id: String) => {
		return (
			<>
				{id === 'login' && <Login />}
				{id === 'notFound' && <NotFound />}
				{(id === 'account' || id === 'dashboard') && (
					<>
						<AppBar position="fixed" open={isOpenDrawer}>
							<Toolbar>
								<IconButton
									color="inherit"
									aria-label="open drawer"
									onClick={handleDrawerOpen}
									edge="start"
									sx={{
										marginRight: 5,
										...(isOpenDrawer && { display: 'none' }),
									}}
								>
									<MenuIcon />
								</IconButton>
								<Typography variant="h6" noWrap component="div">
									HUFI E-LAB
								</Typography>

								<Box sx={{ flexGrow: 0, position: 'absolute', right: '3%' }}>
									<Tooltip title="Open settings">
										<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
											<Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
										</IconButton>
									</Tooltip>
									<Menu
										sx={{ mt: '45px' }}
										id="menu-appbar"
										anchorEl={anchorElUser}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										keepMounted
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										open={Boolean(anchorElUser)}
										onClose={handleCloseUserMenu}
									>
										{settings.map((setting, index) => (
											<MenuItem
												key={index}
												onClick={handleCloseUserMenu}
												sx={{
													padding: 0,
												}}
											>
												<Link
													to={setting.link}
													style={{
														padding: '6px 16px',
														textDecoration: 'none',
														color: 'unset',
														width: '100%',
													}}
												>
													<Typography textAlign="center">{setting.text}</Typography>
												</Link>
											</MenuItem>
										))}
									</Menu>
								</Box>
							</Toolbar>
						</AppBar>
						<div className="container">
							<DrawerLeft />
							{id === 'dashboard' && <Dashboard />}
							{id === 'account' && <Account />}
						</div>
					</>
				)}
				<Footer />
			</>
		);
	};

	return (
		<div className="App">
			<Routes>
				<Route element={_renderRouteElement('login')} path="/login" />
				<Route element={<Logout />} path="/logout" />
				<Route element={_renderRouteElement('dashboard')} path="/" />
				<Route element={_renderRouteElement('account')} path="/account" />
				<Route element={_renderRouteElement('notFound')} path="*" />
			</Routes>
		</div>
	);
}

export default App;
