import { Box, CssBaseline, Skeleton, Stack } from '@mui/material';
import React, { useState } from 'react'
import Post from './Post';

const Feed = () => {
    const [loading, setLoading] = useState(true);
   
    setTimeout(() => {
      setLoading(false);
    }, [200]);

  return (
<Box flex={4} sx={{ marginTop: { xs: '32px', md: '40px' }, p: { xs: 0, md: 2 }, width: "70%" }}>
 <CssBaseline/>    
    <Post />
</Box>
  )
}

export default Feed