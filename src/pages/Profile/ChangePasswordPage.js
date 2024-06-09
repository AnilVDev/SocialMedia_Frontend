import React, { useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Navbar from '../../components/Navbar/Navbar'
import { Box, CssBaseline } from '@mui/material'
import useAxios from '../../Slice/useAxios';
import { useDispatch } from 'react-redux';
import { getUserInfo, reset } from '../../Slice/authSlice';
import { useSelector } from 'react-redux';
import ChangePassword from '../../components/Profile/ChangePassword';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));



function ChangePasswordPage() {
    const { user } = useSelector((state) => state.auth)
    const axiosInstance = useAxios(user?.access);
    const dispatch = useDispatch()
    
    useEffect(() => {
    
        dispatch(getUserInfo(axiosInstance));
    
    }, [])
  

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

        <Navbar/>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }} display="flex">
          <DrawerHeader />
            <ChangePassword />
        </Box>
        
    </Box>
  )
}

export default ChangePasswordPage
