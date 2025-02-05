import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Popper, Box, Typography, Button, Avatar, Grid, Paper } from '@mui/material';
import { ALL_COMMENTS } from '../../Graphql/GraphqlQuery';

const api = process.env.REACT_APP_MEDIA_API;


function NewsFeedComment({ postId }) {
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);



  const { data, loading, error } = useQuery(ALL_COMMENTS, {
    variables: { postId },
    skip: !showComments,
  });

  const handleButtonClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setShowComments(!showComments);
  };

  // return (
  //   <>
  //   <Button
  //     onClick={handleButtonClick}
  //     sx={{
  //       position: 'relative',
  //       bottom: 0,
  //       right: 0,
  //       fontSize: '0.7rem',
  //       fontStyle: 'italic',
  //       textTransform: 'lowercase',
  //       mb:1,
  //     }}
  //   >
  //     See all comments
  //   </Button>

  //   <Popper open={showComments} anchorEl={anchorEl} placement="bottom-start">
  //     <Paper sx={{ maxHeight: 300, overflowY: 'auto', width: 650 }}>
  //       <Box p={2}>
  //         {loading && <Typography>Loading...</Typography>}
  //         {error && <Typography>Error fetching comments</Typography>}
  //         {data && data.allComments.length === 0 && (
  //           <Typography>No comments yet</Typography>
  //         )}
  //         {data && data.allComments.length > 0 && (
  //           data.allComments.map((comment) => (
  //             <Box key={comment.id} sx={{ mb: 2 }}>
  //               <Grid container alignItems="center">
  //                 {/* Profile picture and username */}
  //                 <Grid item>
  //                   <Avatar src={`${api}${comment.user.profilePicture}`} alt={comment.user.username} sx={{ width: '25px', height: '25px' }} />
  //                   <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>{comment.user.username}</Typography>
  //                 </Grid>
  //                 {/* Comment content */}
  //                 <Grid item xs={7}>
  //                   <Typography variant="body2" sx={{ fontWeight: 'bold', pl: 1 }}>{comment.content}</Typography>
  //                 </Grid>
  //                 {/* Date and time */}
  //                 <Grid item xs={4}>
  //                   <Typography sx={{ fontSize: '0.6rem', fontStyle: 'italic', textAlign: "right" }}>
  //                     {comment &&
  //                       new Date(comment.createdAt).toLocaleTimeString('en-US', {
  //                         hour: 'numeric',
  //                         minute: 'numeric',
  //                         hour12: true,
  //                         timeZone: 'Asia/Kolkata', // Indian time zone
  //                       })}
  //                   </Typography>
  //                   <Typography sx={{ fontSize: '0.6rem', fontStyle: 'italic', textAlign: "right" }}>
  //                     {comment &&
  //                       new Date(comment.createdAt).toLocaleDateString('en-US', {
  //                         month: 'short',
  //                         day: 'numeric',
  //                         year: 'numeric',
  //                       })}
  //                   </Typography>
  //                 </Grid>
  //               </Grid>
  //             </Box>
  //           ))
  //         )}
  //       </Box>
  //     </Paper>
  //   </Popper>
  // </>
  // );

  return (
    <>
      <Button
        onClick={handleButtonClick}
        sx={{
          position: 'relative',
          fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' },
          fontStyle: 'italic',
          textTransform: 'lowercase',
          mb: 1,
        }}
      >
        See all comments
      </Button>

      <Popper open={showComments} anchorEl={anchorEl} placement="bottom-start">
        <Paper sx={{ maxHeight: 300, overflowY: 'auto', width: { xs: '90%', sm: 320, md: 550 } }}>
          <Box p={2}>
            {loading && <Typography>Loading...</Typography>}
            {error && <Typography>Error fetching comments</Typography>}
            {data && data.allComments.length === 0 && (
              <Typography>No comments yet</Typography>
            )}
            {data && data.allComments.length > 0 && (
              data.allComments.map((comment) => (
                <Box key={comment.id} sx={{ mb: 2 }}>
                  {/* Profile and Username Row */}
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={2} sm={1} md={1}>
                      <Avatar
                        src={`${api}${comment.user.profilePicture}`}
                        alt={comment.user.username}
                        sx={{ width: { xs: 18, sm: 22, md: 25 }, height: { xs: 18, sm: 22, md: 25 } }}
                      />
                    </Grid>
                    <Grid item xs={10} sm={11} md={8}>
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' } }}>
                        {comment.user.username}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* Comment and Date Row */}
                  <Grid container alignItems="center" spacing={1} >
                    <Grid item xs={8}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' }, pl: {xs :1 ,sm: 2, md:5} }}
                      >
                        {comment.content}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} textAlign="right">
                      <Typography
                        sx={{ fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem' }, fontStyle: 'italic' }}
                      >
                        {comment &&
                          new Date(comment.createdAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            timeZone: 'Asia/Kolkata',
                          })}
                      </Typography>
                      <Typography
                        sx={{ fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem' }, fontStyle: 'italic' }}
                      >
                        {comment &&
                          new Date(comment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))
            )}
          </Box>
        </Paper>
      </Popper>
    </>
  );
  
}

export default NewsFeedComment;
