import * as React from 'react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {   AddAPhotoRounded, HdrPlusOutlined, Home, Logout, ManageAccounts, Message,  NotificationImportant, Settings,  } from '@mui/icons-material';
import { GiFamilyTree } from 'react-icons/gi';
import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router';
import { useState } from 'react';

import { useEffect } from 'react';
import { getUserInfo, logout } from '../../Slice/authSlice';
import { Grid } from 'antd';
import useAxios from '../../Slice/useAxios';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase';
import { Avatar, Badge, Box, Menu, MenuItem, Tooltip } from '@mui/material';
import Notification from '../Notification/Notification';
import { clearMessageCount } from '../../Slice/messageNotificationSlice';



const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
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

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
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

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#0000FF', 0.05),
  '&:hover': {
    backgroundColor: alpha('#0000FF', 0.1),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));





export default function Navbar() {
 
  const [searchQuery, setSearchQuery] = useState('');
  const { messageNotifyCount, notifications } = useSelector(state => state.messageNotify)
  const totalNotificationCount = notifications?.length;


  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [notification,setNotfication] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user,userInfo } = useSelector((state) => state.auth);
 
  const axiosInstance = useAxios(user?.access);

  useEffect(() => {
      dispatch(getUserInfo(axiosInstance));
  }, []);

  useEffect(() =>{
    
  })

  const handleDrawerOpen = () => {
    setNotfication(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      navigate(`/search?q=${searchQuery}`)     
    }
  }

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = (event) => {
    console.log("mouse enter")
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setAnchorEl(null);
  };

  return (


    <>

      <Drawer variant="permanent" open={true}>
        <DrawerHeader >
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Avatar
          alt={userInfo.username}
          src={userInfo.profile_picture}
          onClick={() => navigate('/profile')}
          sx={{ cursor: 'pointer' }}
        />
        <Typography sx={{fontStyle:'oblique', fontWeight:'bold'}}>{userInfo?.first_name} {userInfo?.last_name}</Typography>
      </Box>
        </DrawerHeader>
        <Divider />
        <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        <List>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={(e) => { navigate('/');}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Home /> 
                </ListItemIcon> 
                <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>   
        <List>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={(e) => handleDrawerOpen()}>
              <ListItemButton 
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Badge badgeContent={totalNotificationCount} color="primary" variant="standard">
                    <Tooltip title='Notifications'>
                       <NotificationImportant /> 
                    </Tooltip>
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Notifications" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>    
        <List>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={(e) => { navigate('/chats'); dispatch(clearMessageCount());}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Badge badgeContent={typeof messageNotifyCount === 'number' ? messageNotifyCount : 0} color="primary" variant="standard">
                    <Tooltip title='Message'>
                      <Message /> 
                    </Tooltip>
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Messages" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>   
        <List>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={(e) => { navigate('/profile');}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <ManageAccounts /> 
                </ListItemIcon>
                <ListItemText primary="Profile" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>   
        <List>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={(e) => { navigate('/create-post');}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <AddAPhotoRounded /> 
                </ListItemIcon>
                <ListItemText primary="Create Post" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>  
        <List>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={(e) => { navigate('/family-tree');}}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <GiFamilyTree size="25px" /> 
                </ListItemIcon>
                <ListItemText primary="Family Tree" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List> 
        <List>
            <ListItem  disablePadding sx={{ display: 'block' }}
            //  onClick={(e) => { navigate('/settings');}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
             >
              <ListItemButton  
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Settings /> 
                </ListItemIcon>

                <ListItemText primary="Settings" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMouseLeave}
                  onMouseLeave={handleMouseLeave}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuItem onClick={() => handleMenuItemClick('/settings/change-password')}>Change Password</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('/profile/account-settings')}>Edit Profile</MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('/settings/blocked-users')}>Block</MenuItem>
                </Menu>
            </ListItem>
        </List>   
        <List>
            <ListItem  disablePadding sx={{ display: 'block' }} onClick={handleLogout}>
              <ListItemButton onClick={handleLogout}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <Logout /> 
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>                                           
      </Drawer>
      <Notification open={notification} setOpen={setNotfication} />

      </>
  );
}
