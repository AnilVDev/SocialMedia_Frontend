import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Popper, Box, Typography, Button, Avatar, Grid } from '@mui/material';
import { ALL_COMMENTS } from '../../Graphql/GraphqlQuery';


const api = process.env.REACT_APP_MEDIA_API;

function PostComments({ postId }) {
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { data, loading, error } = useQuery(ALL_COMMENTS, {
    variables: { postId },
    skip: !showComments,
  });

  const handleButtonClick = (event) => {
    console.log("popper is clicked ")
    setAnchorEl(event.currentTarget);
    setShowComments(!showComments);
  };

  return (
    <>
    <Button 
      onClick={handleButtonClick}
      sx={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        fontSize: '0.7rem',
        fontStyle: 'italic',
        textTransform: 'lowercase',
      }}
    >
      See all comments
    </Button>
    <Popper 
      open={showComments} 
      anchorEl={anchorEl}  
      sx={{ zIndex: 9, p: '6px' }}
      placement='right-start'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box pl={2} pt={1} width='350px' height='660px' sx={{ backgroundColor: 'white' }}>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography>Error fetching comments</Typography>}
        {data && data.allComments.length === 0 && (
          <Typography >No comments yet</Typography>
        )}
        {data && data.allComments.length > 0 && (
          data.allComments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 2 }}>
              <Grid container alignItems="center">
                {/* Profile picture and username */}
                <Grid item>
                  <Avatar src={`${api}${comment.user.profilePicture}`} alt={comment.user.username} sx={{ width: '25px', height: '25px' }} />
                  <Typography variant="body2" sx={{ fontSize:'0.7rem'}}>{comment.user.username}</Typography>
                </Grid>
                {/* Comment content */}
                    <Grid item xs={7}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', pl:1 }}>{comment.content}</Typography>
                    </Grid>
                    {/* Date and time */}
                    <Grid item xs={3} >
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
    </Popper>
  </>
  );
}

export default PostComments;
