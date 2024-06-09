import React, { useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material'
import useAxios from '../../Slice/useAxios';
import { useDispatch } from 'react-redux';
import { getUserInfo, reset } from '../../Slice/authSlice';
import { useSelector } from 'react-redux';
import NavbarWithRecentChat from '../../components/Messages/NavbarWithRecentChat';



const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));



function MessagePage() {
    const { user } = useSelector((state) => state.auth)
    const axiosInstance = useAxios(user?.access);
    const dispatch = useDispatch()
    
    useEffect(() => {
    
        dispatch(getUserInfo(axiosInstance));
    //     dispatch(getBio(axiosInstance))
    //     dispatch(reset())
    
    }, [])
  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

        <NavbarWithRecentChat/>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }} display="flex">
          <DrawerHeader />
            {/* <RecentChatList /> */}
            {/* <ChatWindow /> */}
            
        </Box>
        
    </Box>
  )
}

export default MessagePage