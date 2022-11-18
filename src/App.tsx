import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import DrawerLeft from './components/DrawerLeft';
import AppBar from '../src/components/Appbar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from './hooks';
import { RootState } from './store';
import { setIsOpenDrawer } from './pages/appSlice';
import { Box } from '@mui/system';
import { getLaboratories } from './services/laboratoryServices';
import { Login } from './pages/Login';
import Account from './pages/Account';
import { NotFound } from './pages/NotFound';
import 'devextreme/dist/css/dx.light.css';
import Footer from './components/Footer';

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

  const _renderRouteElement = (id: String) => {
    return (
      <>
        {id === "login" && <Login />}
        {id === "notFound" && <NotFound />}
        {(id === "account" || id === "dashboard") && <>
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
                        style={{ padding: '6px 16px', textDecoration: 'none', color: 'unset', width: '100%' }}
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
            {id === "dashboard" && <Dashboard />}
            {id === "account" && <Account />}
          </div>
        </>}
        <Footer />
      </>);
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={_renderRouteElement("login")} path="/login" />
          <Route element={_renderRouteElement("dashboard")} path="/" />
          <Route element={_renderRouteElement("account")} path="/account" />
          <Route element={_renderRouteElement("notFound")} path="*" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
