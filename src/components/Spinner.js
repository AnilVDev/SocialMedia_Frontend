import React from 'react';
import { CircularProgress, Backdrop } from '@mui/material';

function Spinner() {
  return (
    <Backdrop open={true} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="secondary" size={60} thickness={5} />
    </Backdrop>
  );
}

export default Spinner;