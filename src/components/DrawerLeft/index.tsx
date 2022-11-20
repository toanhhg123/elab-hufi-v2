import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MuiDrawer from '@mui/material/Drawer';
import HufiLogoExtended from '../../assets/img/logo-hufi-extended.png';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';
import { defaultSidebarItems, setIsOpenDrawer, setSidebarItems } from '../../pages/appSlice';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function PersistentDrawerLeft() {
  const dispatch = useAppDispatch()
  const theme = useTheme();
  const { isOpenDrawer, sidebarItems } = useAppSelector((state: RootState) => state.app);
  const navigate = useNavigate()

  const handleDrawerClose = () => {
    dispatch(setIsOpenDrawer(false));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Drawer variant="permanent" open={isOpenDrawer}>
        <DrawerHeader>
          <img src={HufiLogoExtended} style={{ maxHeight: "50px", marginTop: "5px", minWidth: "150px" }} alt="" />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {defaultSidebarItems.map((item, index) => (
            <>
              {[4, 8, 12].includes(index) && <div style={{ "paddingTop": "7px" }} />}
              <ListItem key={item.name.toString()} disablePadding sx={{ display: 'block' }}>
                {!isOpenDrawer ? <Tooltip arrow placement="right" title={item.name}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: isOpenDrawer ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    style={{ "backgroundColor": sidebarItems[index].isOpen ? "#DEE1E6" : "white" }}
                    onClick={() => {
                      navigate("/")
                      dispatch(setSidebarItems(index))
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isOpenDrawer ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={item.name} sx={{ opacity: 0 }} onClick={() => {
                      navigate("/")
                      dispatch(setSidebarItems(index))
                    }} />
                  </ListItemButton>
                </Tooltip>
                  :
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: isOpenDrawer ? 'initial' : 'center',
                      px: 2.5,
                    }}
                    style={{ "backgroundColor": sidebarItems[index].isOpen ? "#DEE1E6" : "white" }}
                    onClick={() => {
                      navigate("/")
                      dispatch(setSidebarItems(index))
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isOpenDrawer ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={item.name} sx={{ opacity: 1 }} onClick={() => {
                      navigate("/")
                      dispatch(setSidebarItems(index))
                    }} />
                  </ListItemButton>
                }
              </ListItem>
              {[3, 7, 11].includes(index) && <div style={{ "paddingTop": "7px" }}><Divider /></div>}
            </>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

export default React.memo(PersistentDrawerLeft);