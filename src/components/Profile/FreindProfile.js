import React, { useEffect, useRef } from 'react';
import {  Typography, Avatar,Button, Stack, Box, Grid, Tabs, Tab, CssBaseline, ImageList, ImageListItem, Dialog, DialogContent, Card, CardMedia, CardContent, Popper, Menu, MenuItem, IconButton, Popover, TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getBio, resetPost } from '../../Slice/postSlice';
import useAxios from '../../Slice/useAxios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import {  useQuery,gql, useMutation } from '@apollo/client';
import { Delete, Edit, EditAttributes, FavoriteBorder, ModeEdit, MoreVert } from '@mui/icons-material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ADD_FOLLOWER_MUTATION , UNFOLLOW_MUTATION, CREATE_COMMENT, BLOCK_USER_MUTATION } from '../../Graphql/GraphqlMutation'
import { IS_FOLLOWING_QUERY, FRIEND_FOLLOWERS, FRIEND_FOLLOWING, GET_USER_BY_USERNAME, ALL_COMMENTS } from '../../Graphql/GraphqlQuery'
import { IsLikedButton } from '../Post/IsLikedButton';
import PostComments from '../Post/PostComments';



const api = process.env.REACT_APP_MEDIA_API;

function FriendProfile() {
    const {username} = useParams()
  const [selectedTab, setSelectedTab] = useState(0);
  const buttonRef = useRef(null)

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [selectedPost, setSelectedPost] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const axiosInstance = useAxios(user?.access);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  const { loading, error, data,refetch } = useQuery(GET_USER_BY_USERNAME, { variables: { username: username }  });
  
  const posts = data?.searchedUser.posts || [];
  const userBio = data?.searchedUser.user || {};
  
  const [addFollower, {data:addFollowerData}] = useMutation(ADD_FOLLOWER_MUTATION)

  const [removeFollower,{data:removeFollowerData}] = useMutation(UNFOLLOW_MUTATION)
  
  const {data:isFollows,refetch:refetch_isFollows} = useQuery(IS_FOLLOWING_QUERY, { variables: {followingId: userBio?.id}})
  const isFollowing = isFollows ? isFollows.isFollowing : false;

  const {data:followingUsersData,refetch:followingUsersRefetch} = useQuery(FRIEND_FOLLOWING, {variables :{Id:userBio?.id}})
  const numberOfFollowingUsers = followingUsersData?.friendFollowing?.length || 0;

  const {data:followedUsersData,refetch:followedUsersRefetch} = useQuery(FRIEND_FOLLOWERS, {variables: {Id:userBio?.id}})
  
  const [comment, setComment] = useState('');

  const [addCommentMutation, { data:addCommentData}] = useMutation(CREATE_COMMENT)

  const {refetch: allCommentsRefetch} = useQuery(ALL_COMMENTS)
  
  const [blockUserMutation,{loading:blockUserLoading, data:blockUserDat}] = useMutation(BLOCK_USER_MUTATION)



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
    setAnchor(anchor ? null : event.currentTarget);
  };

  const handleImageClick = (post) => {
    setSelectedPost(post);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleFollow = async (e) =>{
    e.preventDefault();
    console.log("follow clicked")
    const userIdToFollow = userBio.id
    try{
        const response =await addFollower({
            variables: {
              id: userIdToFollow, 
            },
          }); 
        refetch_isFollows()
        followedUsersRefetch()        
    }catch(error){
        toast.error(error.message)
    }
  }

  const handleUnfollow = async (e) =>{
    e.preventDefault();
    console.log("unfollow clicked")
    const userIdToFollow = userBio.id
    try{
        const response =await removeFollower({
            variables: {
              id: userIdToFollow, 
            },
          }); 
        refetch_isFollows() 
        followedUsersRefetch() 
    }catch(error){
        toast.error(error.message)
    }
  }


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
    if (error.message === "User is not active") {
      navigate('/login')
    }
    toast.error(error.message,{ toastId: 'errorMessage' });
  }

    useEffect(() => {
        refetch()
        followingUsersRefetch()
        followedUsersRefetch()
        if (selectedPostIndex !== null && selectedPostIndex >= 0 && selectedPostIndex < posts.length) {
          setSelectedPost(posts[selectedPostIndex]);
        }
    }, []);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleBlockUser = async () => {
      try {
        const { data } = await blockUserMutation({
          variables: { blockedBy: userBio.id }
        });
        console.log('Blocked user:', data.blockUser.blockedUser);
        toast('Blocked')
      } catch (error) {
        if (error.message === "User is not active" || error.message === "Invalid token or user not found") {
          navigate('/login')
        }
        console.error('Error blocking user:', error);
      }
        handleMenuClose();
    };


  return (
    <Stack>
        {loading && <p>Loading user details...</p>}
        <CssBaseline />
        <Stack direction="row" spacing={4} marginTop={22}>
            <Box>
                <Avatar src={`${api}${userBio?.profilePicture}`} sx={{ width: 150, height: 150, marginBottom: 2 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 'large' }}>{userBio?.firstName} {userBio?.lastName}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 'smaller' }}>@{userBio?.username}</Typography>
            </Box>

                <Box width="500px">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} >
                    {/* Post Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontSize: '20px', fontFamily: 'Arial, sans-serif' }}>{posts.length}</Typography>
                    <Typography variant="body1" color="dark" sx={{ width: 'fit-content',
                                '&:hover': {
                                    cursor: 'pointer'
                                }
                     }}
                    >Post</Typography>
                    </Box>

                    {/* Follow/Unfollow Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontSize: '20px', fontFamily: 'Arial, sans-serif', cursor:'pointer' }} onClick={() => navigate(`/${username}/followers`)}>{followedUsersData?.friendFollowers.length}</Typography>
                    {isFollowing ? (
                        <Typography variant="body1" onClick={handleUnfollow} 
                        sx={{ width: 'fit-content',
                        '&:hover': {
                            cursor: 'pointer'
                        }
                     }}
                        >Unfollow</Typography>
                    ) : (
                        <Typography variant="body1" color="primary" onClick={handleFollow} 
                        sx={{ width: 'fit-content',
                        '&:hover': {
                            cursor: 'pointer'
                        }
                     }}
                        >Follow</Typography>
                    )}
                    </Box>

                    {/* Following Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor:'pointer' }} onClick={(e) => navigate(`/${username}/following`)}>
                    <Typography variant="body2" sx={{ fontSize: '20px', fontFamily: 'Arial, sans-serif' }}>{followingUsersData?.friendFollowing.length}</Typography>
                    <Typography variant="body1" color="dark" sx={{ width: 'fit-content',
                                '&:hover': {
                                    cursor: 'pointer'
                                }
                     }}
                    >Following</Typography>
                    </Box>
                    <Button variant="outlined" size="small" onClick={(e) => navigate(`/chats/${username}`)}>message</Button>
                    <Button  size="small" onClick={handleMenuClick}>
                      <MoreVert />
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleBlockUser}>Block</MenuItem>
                    </Menu>
                </Box>

                {/* Bio */}
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


      <Dialog open={openModal} onClose={handleCloseModal} maxWidth='md' sx={{ zIndex: 9 }}>
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end',pt:1 }}>
        <ModeEdit />
        <Delete 
          onClick = {(e)=>handleDeletePost(e,selectedPost.id)}
        />
      </Box> */}
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
            <CardContent>
              {/* <Typography gutterBottom variant="h5" component="div">
                {selectedPost?.des} 
              </Typography> */}
              <Typography variant="body2" color="text.secondary">
                {selectedPost?.description} {/* Assuming there's a 'description' field in post */}
              </Typography>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* <FavoriteBorder sx={{ marginRight: '4px' }} />
                  <Typography variant="body2">650 likes</Typography> */}
                  <IsLikedButton postId={selectedPost?.id}/>
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
                placeholder=" Write a comment... 😊"
                value={comment}
                onChange={handleCommentChange}
                maxLength='500'
                style={{ 
                  flex: 1, 
                  minHeight: 30, 
                  resize: 'none', 
                  marginRight: '10px',
                  fontFamily: 'Arial, sans-serif',
                  border: '2px solid #ccc', 
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
    </Stack>
  );
}

export default FriendProfile


