import React, { useEffect, useRef } from 'react';
import {  Typography, Avatar,Button, Stack, Box, Grid, Tabs, Tab, CssBaseline, ImageList, ImageListItem, Dialog, DialogContent, Card, CardMedia, CardContent, styled, Switch, TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getBio, resetPost } from '../../Slice/postSlice';
import useAxios from '../../Slice/useAxios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import {  useQuery, useMutation } from '@apollo/client';
import { AddComment, Cancel, Delete, Edit, EditAttributes, Favorite, FavoriteBorder, ModeEdit, Save } from '@mui/icons-material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FOLLOWING,FOLLOWERS, POST_QUERY, IS_LIKED_QUERY, TOTAL_LIKES_QUERY, ALL_COMMENTS } from '../../Graphql/GraphqlQuery'
import { DELETE_POST,UPDATE_POST, LIKE_POST, CREATE_COMMENT } from '../../Graphql/GraphqlMutation'
import { IsLikedButton } from '../Post/IsLikedButton';
import PostComments from '../Post/PostComments';
import Spinner from '../Spinner';


const InputWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(2),
}));



const api = process.env.REACT_APP_MEDIA_API;


function ProfileDetails() {
  const [selectedTab, setSelectedTab] = useState(0);
  const buttonRef = useRef(null)

  const dispatch = useDispatch() 
  const { user } = useSelector((state) => state.auth)
  const { userBio, userPost } = useSelector((state) =>state.post)
  const navigate = useNavigate()

  const [selectedPost, setSelectedPost] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const axiosInstance = useAxios(user?.access);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  const {loading, error, data,refetch:postRefetch} = useQuery(POST_QUERY)
  const posts = data?.posts || [];  

  const [deletePostMutation, { loading: deleteLoading, error: deleteError, data: deleteData }] = useMutation(DELETE_POST);
  const [updatePostMutation, {loading: updadeLoading,error:updateError,data:updateData}] =useMutation(UPDATE_POST)

  const [editedDescription, setEditedDescription] = useState(selectedPost?.description);
  const [editedDate,setEditedDate] = useState(selectedPost?.dataOfMemory)
  const [editedPrivacy,setEditedPrivacy] = useState(selectedPost?.privacySettings)
  const [openEditPostModal, setOpenEditPostModal] = useState(false);

  const {data:followingUsersData,refetch:followingUsersRefetch} = useQuery(FOLLOWING)
  const numberOfFollowingUsers = followingUsersData?.following?.length || 0;

  const {data:followedUsersData,refetch:followedUsersRefetch} = useQuery(FOLLOWERS)
  const numberOfFollowedUsers = followedUsersData?.followers?.length || 0;

  const [comment, setComment] = useState('');

  const [addCommentMutation, { data:addCommentData}] = useMutation(CREATE_COMMENT)

  const {refetch: allCommentsRefetch} = useQuery(ALL_COMMENTS)

  if (error) {
    if (error.message === "User is not active" || error.message === "Invalid token or user not found") {
      navigate('/login')
    }
    toast.error(error.message,{ toastId: 'errorMessage' });
  }
  useEffect(()=>{
    postRefetch()
    followingUsersRefetch()
    followedUsersRefetch()
  },[])

  // Function to handle clicking the left arrow button
  const handlePreviousImage = () => {
    setSelectedPostIndex(prevIndex => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
    handleImageClick(posts[selectedPostIndex === posts.length - 1 ? 0 : selectedPostIndex - 1]);  
  };

  // Function to handle clicking the right arrow button
  const handleNextImage = () => {
    setSelectedPostIndex(prevIndex => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));
    handleImageClick(posts[selectedPostIndex === posts.length - 1 ? 0 : selectedPostIndex + 1]);
  };
  const handlePopperOpen = (event) => {
    console.log("popper clicked", anchor)
    setAnchor(anchor ? null : event.currentTarget);
  };

  const handleImageClick = (post) => {

    // setSelectedPost(post);
    // setOpenModal(true);
      navigate(`/${userBio?.username}/post/${post.id}`);

  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDeletePost = async (e,id) =>{
    e.preventDefault();
    try{
      const response = await deletePostMutation({
        variables: {
          id:id
        }
      })
      if (response.data.deletePost.success) {

        toast.success("Post deleted successfully");
        postRefetch()
        handleNextImage()
      } else {
        toast.error("Failed to delete post");
      }
    }catch(error){
      toast.error(error.message || "An error occurred while deleting the post.");
    }

  }

  const handleEditPost = () => {
    console.log("edit modal clicked")
    handleCloseModal()
    setEditedDate(selectedPost.dataOfMemory)
    setEditedDescription(selectedPost.description)
    setEditedPrivacy(selectedPost.privacySettings)
    setOpenEditPostModal(true); // Open edit post modal
  };

  const handleCloseEditPostModal = () => {
    setOpenEditPostModal(false); // Close edit post modal
  };



  const handleSaveChanges = async () => {
    try {
      console.log("updating...",editedDate,editedDescription,editedPrivacy)
      const response = await updatePostMutation({
        variables: {
          id: selectedPost.id,
          description: editedDescription,
          privacySettings: editedPrivacy !== null ? editedPrivacy : selectedPost.privacySettings,
          dateOfMemory: editedDate !== null ? editedDate : selectedPost.dateOfMemory,
        },
      });

      if (response.data.updatePost.success) {
        toast.success('Post updated successfully');
        postRefetch()
        handleCloseEditPostModal();
      } else {
        // Handle update failure
        toast.error('Failed to update post');
      }
    } catch (error) {
      console.error('An error occurred while updating the post:', error.message);
    }
  };

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




    useEffect(() => {
        dispatch(getBio(axiosInstance));
        if (selectedPostIndex !== null && selectedPostIndex >= 0 && selectedPostIndex < posts.length) {
          setSelectedPost(posts[selectedPostIndex]);
        }
        return () => {
        dispatch(resetPost()); 
        };
    }, []);
  return (
    <Stack>
        <CssBaseline />
        <Stack direction="row" spacing={4} marginTop={22}>
            <Box>
                <Avatar src={`${api}${userBio?.profilePicture}`} sx={{ width: 150, height: 150, marginBottom: 2 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 'large' }}>{userBio?.firstName} {userBio?.lastName}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 'smaller' }}>@{userBio?.username}</Typography>
            </Box>
            <Box width="500px">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    {/* Post Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontSize: '20px', fontFamily: 'Arial, sans-serif' }}>{posts.length}</Typography>
                    <Typography variant="body1" color="dark" sx={{ width: 'fit-content',
                                '&:hover': {
                                  cursor: 'pointer'
                              }
                      }}
                    >posts</Typography>
                    </Box>

                    {/* Follow/Unfollow Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      onClick={() => navigate('/followers')}
                    >
                      <Typography variant="body2" sx={{ fontSize: '20px', fontFamily: 'Arial, sans-serif' }}>{numberOfFollowedUsers}</Typography>
                      <Typography variant="body1" color="dark" sx={{ width: 'fit-content', 
                                    '&:hover': {
                                      cursor: 'pointer'
                                  }
                        }}
                        >followers</Typography>
                    </Box>
                    {/* Following Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      onClick={() => navigate('/following')}
                    >
                    <Typography variant="body2" sx={{ fontSize: '20px', fontFamily: 'Arial, sans-serif' }}>{numberOfFollowingUsers}</Typography>
                    <Typography variant="body1" color="dark" sx={{ width: 'fit-content', 
                                '&:hover': {
                                  cursor: 'pointer'
                              }
                      }}
                    >following</Typography>
                    </Box>
                    <Button variant="outlined" size="small" onClick={(e) => navigate('/profile/account-settings')}>Edit Profile</Button>
                </Box>
                <Box>
                <Typography sx={{ fontWeight: 'bold', fontSize: 'smaller' }}>Bio</Typography>
                <Typography variant="body1">{userBio?.bio}</Typography>
                </Box>
            </Box>
            </Stack>
            <Grid item xs={12}>
        {/* Tabs for different sections */}
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Posts" />
          {/* <Tab label="IGTV" />
          <Tab label="Tagged" /> */}
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        {/* Content section based on selected tab */}
        {selectedTab === 0 && (
          <Grid container spacing={2}>
            {/* Display user's posts */}
            {/* Example: <PostCard /> components */}
          </Grid>
        )}
        {selectedTab === 1 && (
          <Grid container spacing={2}>
            {/* Display user's IGTV videos */}
            {/* Example: <IGTVVideo /> components */}
          </Grid>
        )}
        {selectedTab === 2 && (
          <Grid container spacing={2}>
            {/* Display tagged photos */}
            {/* Example: <TaggedPhoto /> components */}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        {/* Followers/Following counts section */}
        <ImageList sx={{ width: 750, height: 450 }} cols={4} rowHeight={224}>
          {loading && <Spinner/>}
            {posts.map((post) => (
                <ImageListItem key={post.id}>
                <img
                    srcSet={`${post.image}?w=184&h=184&fit=crop&auto=format&dpr=2 2x`}
                    src={`${api}${post.image}`} 
                    // alt={item.title}
                    onClick={() => handleImageClick(post)}
                    loading="lazy"
                />
                </ImageListItem>
            ))}
        </ImageList>
      </Grid>

{/* See individual Post */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth='md' sx={{ zIndex: 9 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end',pt:1 }}>
        <ModeEdit onClick = {()=>handleEditPost()} />
        <Delete 
          onClick = {(e)=>handleDeletePost(e,selectedPost.id)}
        />
      </Box>
          <ArrowBackIosRoundedIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              zIndex:1
            }}
            onClick={handlePreviousImage}
          />
        <DialogContent sx={{ height: '660px' }}>
        <Box position="relative">
      <Card sx={{ position: 'relative', display: 'inline-block' }}>

            <CardMedia
              component="img"
              height="420"
              image={`${api}${selectedPost?.image}`} // Larger image
              alt="Image"
            />
            <CardContent sx={{pb:0}}>
              {/* <Typography gutterBottom variant="h5" component="div">
                {selectedPost?.des} 
              </Typography> */}
              <Typography variant="body2" color="text.secondary">
                {selectedPost?.description} {/* Assuming there's a 'description' field in post */}
              </Typography>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IsLikedButton postId = { selectedPost?.id } />
                </div>
                <Typography sx={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                  {selectedPost &&
                    new Date(selectedPost.postedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                </Typography>
              </CardContent>

            </CardContent>
            <CardContent style={{ display: 'flex', alignItems: 'center', marginBottom:'15px' }}>
              <TextareaAutosize
                aria-label="comment"
                placeholder=" Write a comment"
                value={comment}
                onChange={handleCommentChange}
                maxLength='500'
                style={{ 
                  flex: 1, 
                  minHeight: 30, 
                  resize: 'none', 
                  marginRight: '10px',
                  fontFamily: 'Arial, sans-serif',
                  border: '2px solid #ccc', // Change the border style here
                  borderRadius: '4px', 
                  alignContent: 'center'
                }}
              />
              <Button variant="contained" size='small' color="primary" onClick={() => handleCommentSubmit(selectedPost.id)}>
                Post
              </Button>
            </CardContent>
              <PostComments postId = {selectedPost?.id} />
          </Card>
        </Box>

        </DialogContent>
          <ArrowForwardIosRoundedIcon
            sx={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              cursor: 'pointer',
            }}
            onClick={handleNextImage}
          />
      </Dialog>


{/* Update Post */}
      <Dialog open={openEditPostModal} onClose={handleCloseEditPostModal} maxWidth='md'>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end',pt:1 ,mr:3}}>
        <Cancel onClick= {handleCloseEditPostModal} />
        <Save 
          onClick = {handleSaveChanges}
        />
      </Box>
        <DialogContent sx={{ height: '620px' }}>
        <Box position="relative">
      <Card sx={{ position: 'relative', display: 'inline-block' }}>

            <CardMedia
              component="img"
              height="420"
              image={`${api}${selectedPost?.image}`} // Larger image
              alt="Image"
            />
            <CardContent>
              <input
                type="text"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
              {/* <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                  {selectedPost &&
                    new Date(selectedPost.postedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                </Typography>
              </CardContent> */}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Memory date"
                    value={editedDate}
                    onChange={(newValue) => {
                      if (newValue !== null) {
                        const formattedDate = dayjs(newValue).format("YYYY/MM/DD");
                                if (formattedDate !== editedDate) {
                                  setEditedDate(formattedDate);
                                }
                      }
                    }}
                    views={['year', 'month', 'day']}
                    inputFormat="YYYY/MM/DD"
                    slotProps={{
                      textField: {
                        size: 'small',
                      },
                    }}
                  />
                </LocalizationProvider>
                
                <InputWrapper>
                  <Typography variant="body1">
                    Who can see?
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    marginLeft={2}
                  >
                    <Switch
                      checked={editedPrivacy}
                      onChange={() => setEditedPrivacy(!editedPrivacy)}
                    />
                  </Box>
                  <Typography variant="body1">
                    {editedPrivacy ? 'Friends' : 'Everyone'}
                  </Typography>
                </InputWrapper>
              </Box>

            </CardContent>
          </Card>
        </Box>
        </DialogContent>
      </Dialog>



    </Stack>
  );
}




export default ProfileDetails;
