import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { Box } from '@mui/system';
import 'devextreme/dist/css/dx.light.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import AppBar from '../src/components/Appbar';
import './App.css';
import DrawerLeft from './components/DrawerLeft';
import Footer from './components/Footer';
import { getFromLocalStorage } from './configs/apiHelper';
import { useAppDispatch, useAppSelector } from './hooks';
import { setOwner, setToken } from './layouts/UserManager/userManagerSlice';
import Account from './pages/Account';
import { setIsOpenDrawer } from './pages/appSlice';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { getEmployeeOwner } from './services/employeeServices';
import { getLaboratories } from './services/laboratoryServices';
import { RootState } from './store';

const settings = [
	{
		text: 'Tài khoản',
		link: '/account',
	},
	{
		text: 'Đăng xuất',
		link: '/login',
	},
];

function App() {
	const isOpenDrawer: boolean = useAppSelector((state: RootState) => state.app.isOpenDrawer);
	const dispatch = useAppDispatch();

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

	useEffect(() => {
		const getUserLocal = async () => {
			const user = await getFromLocalStorage('user');

			if (user) {
				getEmployeeOwnerData();
				dispatch(setToken(user));
			};
		};

		getUserLocal();
	});

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
			<Router>
				<Routes>
					<Route element={_renderRouteElement('login')} path="/login" />
					<Route element={_renderRouteElement('dashboard')} path="/" />
					<Route element={_renderRouteElement('account')} path="/account" />
					<Route element={_renderRouteElement('notFound')} path="*" />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
