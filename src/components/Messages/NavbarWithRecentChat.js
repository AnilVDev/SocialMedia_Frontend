import * as React from 'react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
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
import {   AddAPhotoRounded, FiberManualRecordRounded, HdrPlusOutlined, Home, Logout, ManageAccounts, Message,  NotificationImportant, Settings,  } from '@mui/icons-material';
import { GiFamilyTree } from 'react-icons/gi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useEffect } from 'react';
import { getUserInfo, logout } from '../../Slice/authSlice';
import useAxios from '../../Slice/useAxios';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase';
import { useMutation, gql, useQuery } from '@apollo/client';
import { Avatar, Badge, Button, ListItemAvatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { GET_RECENT_CHATS } from '../../Graphql/GraphqlQuery';
import { toast } from 'react-toastify';
import { green } from '@mui/material/colors'
import Spinner from '../Spinner';
import { UPDATE_MESSAGE_SEEN } from '../../Graphql/GraphqlMutation';
import Notification from '../Notification/Notification';
import { clearMessageCount, resetMessageSent } from '../../Slice/messageNotificationSlice';

const api = process.env.REACT_APP_MEDIA_API;

const totalWidth = 320;
const drawerWidth = 60;
const chatDrawerWidth = 240;



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

const ContentContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: '100vh', // Set height to fill the viewport height
  }));
  
  const ChatDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: chatDrawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
     
      ...(open && {
        width: chatDrawerWidth,
        '& .MuiDrawer-paper': {
          width: chatDrawerWidth,
        },
      }),
    }),
  );
  
  const ChatDrawerContent = styled(Box)(({ theme }) => ({
    overflowY: 'auto', // Add vertical scroll if content exceeds height
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    
  }));



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





export default function NavbarWithRecentChat() {

  const { loading, error, data: recentChatData, refetch: recentChatRefetch } = useQuery(GET_RECENT_CHATS);
 
  const [searchQuery, setSearchQuery] = useState('');
  const { messageNotifyCount,notifications,isMessageSent } = useSelector(state => state.messageNotify)

  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [notification,setNotfication] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user,userInfo } = useSelector((state) => state.auth);
  const { userOnline } = useSelector(state => state.onlineStatus);
 
  const [ messageSeenMutation, {data:messageSeenData} ] = useMutation(UPDATE_MESSAGE_SEEN)
  
  const axiosInstance = useAxios(user?.access);


  useEffect(() => {
      dispatch(getUserInfo(axiosInstance));
      recentChatRefetch()
  }, []);

  useEffect(()=>{
    if(messageNotifyCount){
      recentChatRefetch()
    }
  },[messageNotifyCount,recentChatRefetch,navigate])

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
      recentChatRefetch({ searchQuery })    
    }
  }

  if (error) {
    if (error.message === "User is not active" || error.message === "Invalid token or user not found") {
      navigate('/login')
    }
    toast.error(error.message,{ toastId: 'errorMessage' });
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

  useEffect(() => {
    if (isMessageSent) {
      recentChatRefetch()
      dispatch(resetMessageSent());
    }
}, [isMessageSent, dispatch]);


  return (
<>
<ContentContainer>
       <Drawer variant="permanent" open={open} >
         <DrawerHeader >
         <Avatar
                    alt={userInfo.username} 
                    src={userInfo.profile_picture}
                    onClick = {() => navigate('/profile')}
                    sx={{ cursor: 'pointer' }} 
                  />
           {/* <Typography >{userInfo?.first_name} {userInfo?.last_name}</Typography> */}
         </DrawerHeader>
         <Divider />
        {/* <Search>
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
          </Search> */}

        <List>
            <ListItem  disablePadding sx={{ display: 'block' }} >
              <ListItemButton
                sx={{
                  minHeight: 36,
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
                  <SearchIcon /> 
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
        </List> 


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
                    <Tooltip title='Home'>
                  <Home /> 
                    </Tooltip>
                </ListItemIcon>
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
                    <Tooltip title='Notifications'>
                  <NotificationImportant /> 
                    </Tooltip>
                </ListItemIcon>
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
                    <Tooltip title='Profile'>
                  <ManageAccounts /> 
                    </Tooltip>
                </ListItemIcon>
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
                    <Tooltip title='Create Post'>
                  <AddAPhotoRounded /> 
                    </Tooltip>
                </ListItemIcon>
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
                    <Tooltip title='Family Tree'>
                  <GiFamilyTree size="25px" /> 
                    </Tooltip>
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
        </List> 
        <List>
            <ListItem  disablePadding sx={{ display: 'block' }} 
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
                    <Tooltip title='Settings'>
                  <Settings /> 
                    </Tooltip>
                </ListItemIcon>
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
                    <Tooltip title='Logout'>
                  <Logout /> 
                    </Tooltip>
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
        </List>                                           
      </Drawer>


        {/* Chat Drawer */}
        <Box sx={{ position: 'fixed', left: '70px', width: '280px' ,boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)' }} >
        <div style={{ height: '800px', overflowY: 'auto', backgroundColor:'white' }}>
        <DrawerHeader >

        <Typography >{userInfo?.first_name} {userInfo?.last_name}</Typography>
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
          


        <ChatDrawerContent>
          { 
          Array.isArray(recentChatData?.recentChats) && recentChatData.recentChats.map(chat => {
            const otherUsername = getOtherUser(userInfo, chat).username;
            const isOnline = userOnline[otherUsername] || false;
            const isOtherUserSender = chat.sender.username === otherUsername;
            const fontWeight = !chat.isSeen && isOtherUserSender ? 'bold' : 'normal';

            return (
              <React.Fragment key={chat.id}>
                <ListItem alignItems="center" justifyContent="center" onClick={e => {
                    navigate(`/chats/${getOtherUser(userInfo, chat).username}`); 
                    messageSeenMutation({variables:{username:otherUsername}});
                    recentChatRefetch();
                  }}
                  sx={{ cursor:'pointer'}}
                >
                  <ListItemAvatar sx={{mr:1, position: 'relative'}}>
                    <Avatar alt="" src={`${api}${getOtherUser(userInfo, chat).profilePicture}`} 
                      sx={{ width:50,height:50}}
                      onClick = {() => navigate(`/${getOtherUser(userInfo, chat).username}`)}
                    />
                    {isOnline && (
                      <FiberManualRecordRounded sx={{ color: green[500], fontSize: 18, position: 'absolute', top: 'calc(100% - 16px)', left: 'calc(100% - 16px)' }} />
                    )}          
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Button sx={{ fontSize: '12px' }}>
                        {`${getOtherUser(userInfo, chat).firstName} ${getOtherUser(userInfo, chat).lastName}`}
                      </Button>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline',fontWeight }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {chat.message}
                        </Typography>
                      </React.Fragment>
                    }
                  />                            
                </ListItem>
              </React.Fragment>
            );
          })
        }
        </ChatDrawerContent>



     </div>
        </Box>

      </ContentContainer>
      <Notification open={notification} setOpen={setNotfication} />
      </>
   );
}


function getOtherUser(userInfo, chat) {
  return userInfo.username === chat.sender.username
    ? chat.receiver
    : chat.sender;
}
