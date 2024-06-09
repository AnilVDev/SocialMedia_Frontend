import React,{ useEffect, useState } from 'react';
import {  Typography,Button, Box,  Dialog, DialogContent, Card, CardMedia, CardContent, TextareaAutosize } from '@mui/material';
import { Cancel, Delete, ModeEdit, Save, } from '@mui/icons-material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { IsLikedButton } from '../Post/IsLikedButton';
import PostComments from '../Post/PostComments';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_COMMENT, DELETE_POST, UPDATE_POST } from '../../Graphql/GraphqlMutation';
import { ALL_COMMENTS, POST_QUERY } from '../../Graphql/GraphqlQuery';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Spinner from '../Spinner';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Switch, styled } from '@mui/joy';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const api = process.env.REACT_APP_MEDIA_API;


const InputWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  }));
  

function IndividualPostDialog() {
    const { postId } = useParams();
    const currentDate = dayjs().subtract(0, 'day');
    const { userInfo } = useSelector((state) =>state.auth)
    const navigate = useNavigate()

    const [deletePostMutation, { loading: deleteLoading, error: deleteError, data: deleteData }] = useMutation(DELETE_POST);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedPostIndex, setSelectedPostIndex] = useState(null);
    const [openModal, setOpenModal] = useState(true);

    const {loading, error, data,refetch:postRefetch} = useQuery(POST_QUERY)
    const posts = data?.posts || [];

    const [comment, setComment] = useState('');

    const [addCommentMutation, { data:addCommentData}] = useMutation(CREATE_COMMENT)
  
    const {refetch: allCommentsRefetch} = useQuery(ALL_COMMENTS)

    const [updatePostMutation, {loading: updadeLoading,error:updateError,data:updateData}] =useMutation(UPDATE_POST)

    const [editedDescription, setEditedDescription] = useState(selectedPost?.description);
    const [editedDate,setEditedDate] = useState(selectedPost?.dataOfMemory)
    const [editedPrivacy,setEditedPrivacy] = useState(selectedPost?.privacySettings)
    const [openEditPostModal, setOpenEditPostModal] = useState(false);

    useEffect(() => {
        if (posts.length > 0) {
            const initialPostIndex = posts.findIndex(post => post.id === postId);
            if (initialPostIndex !== -1) {
                setSelectedPost(posts[initialPostIndex]);
                setSelectedPostIndex(initialPostIndex);
                setOpenModal(true);
            }
        }
    }, [posts, postId]);


  const handleImageClick = (post) => {

    setSelectedPost(post);
    setOpenModal(true);

  };
  if (error) {
    if (error.message === "User is not active" || error.message === "Invalid token or user not found") {
      navigate('/login')
    }
    toast.error(error.message,{ toastId: 'errorMessage' });
  }


  // Function to handle clicking the left arrow button
  const handlePreviousImage = () => {
    const newIndex = selectedPostIndex === 0 ? posts.length - 1 : selectedPostIndex - 1;
    setSelectedPostIndex(newIndex);
    setSelectedPost(posts[newIndex]);
    updateUrlWithPostId(posts[newIndex].id);
  };

  // Function to handle clicking the right arrow button
  const handleNextImage = () => {
    const newIndex = selectedPostIndex === posts.length - 1 ? 0 : selectedPostIndex + 1;
    setSelectedPostIndex(newIndex);
    setSelectedPost(posts[newIndex]);
    updateUrlWithPostId(posts[newIndex].id);
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

  const handleEditPost = () => {
    console.log("edit modal clicked")
    // handleCloseModal()
    setEditedDate(selectedPost.dataOfMemory)
    setEditedDescription(selectedPost.description)
    setEditedPrivacy(selectedPost.privacySettings)
    setOpenEditPostModal(true); 
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


  
  const handleCloseModal = () => {
    setOpenModal(false);
    navigate(-1)
  };

  const updateUrlWithPostId = (postId) => {
    window.history.pushState({}, null, `/${userInfo?.username}/post/${postId}`);
  }

  const handleCloseEditPostModal = () => {
    setOpenEditPostModal(false);
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
  
  return (
    <>
        <ArrowBackIosRoundedIcon
        sx={{
            position: 'fixed',
            top: 'calc(50% - 20px)',
            left: 40,
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            zIndex: 1000,
            transition: 'background-color 0.3s', 
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '50%',
              width: '40px', 
              height: '40px' 
            }
        }}
      onClick={handlePreviousImage}
    />
    <Dialog open={openModal} onClose={handleCloseModal} maxWidth='md' sx={{ zIndex: 9 }}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end',pt:1 }}>
    <ModeEdit onClick = {()=>handleEditPost()} />
    <Delete 
        onClick = {(e)=>handleDeletePost(e,selectedPost.id)}
    />
    {deleteLoading && <Spinner /> }
    </Box>

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

    </Dialog>
    <ArrowForwardIosRoundedIcon
        sx={{
            position: 'absolute',
            top: 'calc(55% - 20px)',
            right: 40,
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            zIndex: 1000,
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '50%',
              width: '40px',
              height: '40px'
            } 
        }}
        onClick={handleNextImage}
        />


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
                    maxDate={currentDate}
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

</>
  )
}

export default IndividualPostDialog

