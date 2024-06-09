import React from 'react';
import './Dashboard.css';
import { styled, Paper } from '@mui/material';
import MenuNavbar from '../../components/Admin/MenuNavbar';


function Dashboard() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  })); 
  
  return (
    <div className='Dashboard'>
      <MenuNavbar/>
    </div>
  )
}

export default Dashboard