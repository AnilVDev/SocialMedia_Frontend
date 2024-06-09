import React, { useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Navbar from '../../components/Navbar/Navbar'
import Feed from '../../components/Feed'
import Rightbar from '../../components/Rightbar'
import { Box, CssBaseline } from '@mui/material'
import MyAccount from '../../components/MyAccount';
import useAxios from '../../Slice/useAxios';
import { useDispatch } from 'react-redux';
import { getUserInfo, reset } from '../../Slice/authSlice';
import { useSelector } from 'react-redux';
import { getBio } from '../../Slice/postSlice';
import ProfileEdit from '../../components/Profile/ProfileEdit';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));



function ProfileSettings() {
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

        <Navbar/>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }} display="flex">
          <DrawerHeader />
            {/* <MyAccount /> */}
            <ProfileEdit />
        </Box>
        
    </Box>
  )
}

export default ProfileSettings