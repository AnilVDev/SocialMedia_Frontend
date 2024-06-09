import { Favorite, FavoriteBorder, MoreVert, PolylineTwoTone, Share } from '@mui/icons-material'
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, IconButton, TextareaAutosize, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NEWSFEED_POSTS_QUERY, ALL_COMMENTS } from '../Graphql/GraphqlQuery'
import { CREATE_COMMENT } from '../Graphql/GraphqlMutation'
import { useMutation, useQuery } from '@apollo/client'
import { IsLikedButton } from './Post/IsLikedButton'
import Textarea from '@mui/joy/Textarea';
import { toast } from 'react-toastify'
import NewsFeedComment from './Post/NewsFeedComment'
import { useNavigate } from 'react-router'
import Spinner from './Spinner'
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux'
import { clearNewPost } from '../Slice/messageNotificationSlice'


const api = process.env.REACT_APP_MEDIA_API;

function Post() {
  const { loading, error, data:newsFeedData,refetch:newsFeedRefetch } = useQuery(NEWSFEED_POSTS_QUERY);
  const [comment, setComment] = useState('');
  const [addCommentMutation, { loading:addCommentLoading,data:addCommentData}] = useMutation(CREATE_COMMENT)
  const {refetch: allCommentsRefetch} = useQuery(ALL_COMMENTS, {skip: true})
  const navigate = useNavigate();
  const { newPost } = useSelector(state => state.messageNotify)
  const dispatch = useDispatch()
  
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async (post_id) =>{
    try{
      const response = await addCommentMutation({
        variables : {
          post_id,
          comment
        }
      })
      if (response.data.addComment.success){
        toast.success('comment updated')
        setComment('')
        allCommentsRefetch({ postId: post_id })
      }else{
        toast.error('Failed to update the comment')
      }
    }catch(error){
      toast.error(error.message)
    }
  }

  if (error) {
    if (error.message === "User is not active" || error.message === "Invalid token or user not found") {
      navigate('/login')
    }
    toast.error(error.message,{ toastId: 'errorMessage' });
    console.log("error in post",error.message)
  }

  useEffect(()=>{
    newsFeedRefetch()
  },[])

  useEffect(() => {
    if (newPost) {
      newsFeedRefetch(); 
      dispatch(clearNewPost()); 
    }
  }, [newPost, dispatch, newsFeedRefetch]);

  return (
    <>
    
    <div style={{ height: '700px', overflowY: 'auto' }}>
      {loading && <Spinner/>}
    {newsFeedData?.newsfeedPosts && newsFeedData.newsfeedPosts.map(post => (
    <Card sx={{ m: 5, zIndex: 9, borderRadius:1, boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)' }} key={post.id} >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "red", cursor:'pointer' }} aria-label="recipe"
          src = {`${api}${post.user.profilePicture}`} 
          onClick={() => navigate(`/${post.user.username}`)}
          > 
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
        title={
          <span 
            style={{ cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }} 
            onClick={() => navigate(`/${post.user.username}`)}
          >
            {post.user.firstName} {post.user.lastName}
          </span>
        }
        subheader = {post &&
          new Date(post.postedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
      />
      <CardMedia
        component="img"
        height="20%"
        image={`${api}${post.image}`} 
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
         @{post.user.username} - {post.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <IsLikedButton postId = { post?.id } />
        </IconButton>
        {/* <IconButton aria-label="share">
          <Share />
        </IconButton> */}
      </CardActions>
      <CardContent style={{ display: 'flex', alignItems: 'center', marginBottom:'15px' }}>
      <Textarea
          aria-label="comment"
          placeholder="comment"
          value={comment}
          onChange={handleCommentChange}
          maxLength={500} 
          sx={{ 
            flex: 1, 
            minHeight: 30, 
            marginRight: '10px',
            fontFamily: 'Arial, sans-serif',
            border: '2px solid #ccc',
            borderRadius: '4px', 
            alignContent: 'center'
          }}
          />
              <Button
                 variant="contained" 
                 size='small'
                  color="primary" 
                  onClick={() => handleCommentSubmit(post.id)}
                  disabled={addCommentLoading} 
                  sx={{position: 'relative' }} 
                  
              >
                {addCommentLoading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>}
                {!addCommentLoading ? 'Post':'Posting'}
              </Button>
            </CardContent>
              <NewsFeedComment postId = {post?.id} /> 
    </Card>
    ))
      }
      </div>
    </>
  )
}

export default Post