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
    console.log("popper is clicked ")
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setShowComments(!showComments);
  };

  return (
    <>
    <Button
      onClick={handleButtonClick}
      sx={{
        position: 'relative',
        bottom: 0,
        right: 0,
        fontSize: '0.7rem',
        fontStyle: 'italic',
        textTransform: 'lowercase',
        mb:1,
      }}
    >
      See all comments
    </Button>

    <Popper open={showComments} anchorEl={anchorEl} placement="bottom-start">
      <Paper sx={{ maxHeight: 300, overflowY: 'auto', width: 650 }}>
        <Box p={2}>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography>Error fetching comments</Typography>}
          {data && data.allComments.length === 0 && (
            <Typography>No comments yet</Typography>
          )}
          {data && data.allComments.length > 0 && (
            data.allComments.map((comment) => (
              <Box key={comment.id} sx={{ mb: 2 }}>
                <Grid container alignItems="center">
                  {/* Profile picture and username */}
                  <Grid item>
                    <Avatar src={`${api}${comment.user.profilePicture}`} alt={comment.user.username} sx={{ width: '25px', height: '25px' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>{comment.user.username}</Typography>
                  </Grid>
                  {/* Comment content */}
                  <Grid item xs={7}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', pl: 1 }}>{comment.content}</Typography>
                  </Grid>
                  {/* Date and time */}
                  <Grid item xs={4}>
                    <Typography sx={{ fontSize: '0.6rem', fontStyle: 'italic', textAlign: "right" }}>
                      {comment &&
                        new Date(comment.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          timeZone: 'Asia/Kolkata', // Indian time zone
                        })}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6rem', fontStyle: 'italic', textAlign: "right" }}>
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
