import { Avatar, Box, Button, Grid, TextField } from '@mui/material'
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo, reset, updateUserInfo } from '../../Slice/authSlice';
import { Option } from '@mui/base';
import { toast } from 'react-toastify';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import useAxios from '../../Slice/useAxios';
import { useNavigate } from 'react-router';
import { Delete, Upload } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PROFILE } from '../../Graphql/GraphqlMutation';
const { URL } = window;


function ProfileEdit() {

  const { user,userInfo, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const dispatch = useDispatch();
    const [updatedUserInfo, setUpdatedUserInfo] = useState({ ...userInfo || {} });
    const [imageUrl, setImageUrl] = useState(userInfo?.profile_picture || "");
    const [newImage, setNewImage] = useState("")
    const [gender, setGender] = useState(userInfo?.gender)
    const [deleteProfilePicture, setDeleteProfilePicture] = useState(false);
    const navigate = useNavigate()
    console.log(userInfo?.profile_picture)
       
    const axiosInstance = useAxios(user?.access);

    const [updateProfileMutation, {loading,error,data}] = useMutation(UPDATE_USER_PROFILE)

    useEffect(() => {
      if (isError) {
        toast.error(message)
        dispatch(reset())
      }    
      if (isError || isSuccess) {
        dispatch(getUserInfo(axiosInstance));
      }
    }, [isError, isSuccess, message, dispatch])    

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const updatedUser = { ...updatedUserInfo, [id]: value };
        const filteredUser = Object.fromEntries(Object.entries(updatedUser).filter(([key, val]) => val !== undefined));
        setUpdatedUserInfo(filteredUser);
    };
    const handleFileChange = (e) => {
      const newFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(newFile);
      setImageUrl(imageUrl);
      setDeleteProfilePicture(false);

        // const newFile = e.target.files[0]
        const reader = new FileReader() 
    
        reader.onload = (e) => {
          const base64Image = reader.result.split(',')[1];
          setNewImage(base64Image)
          
        }
        reader.onerror = (error) => {
          console.error("Error reading image file:", error);
        };
      
        reader.readAsDataURL(newFile);


      };


    const VisuallyHiddenInput = styled('input')({
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: 1,
      overflow: 'hidden',
      position: 'absolute',
      bottom: 0,
      left: 0,
      whiteSpace: 'nowrap',
      width: 1,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await updateProfileMutation({
            variables:{
                firstName : updatedUserInfo.first_name,
                lastName : updatedUserInfo.last_name,
                mobile : updatedUserInfo.mobile.toString(),
                bio : updatedUserInfo.bio,
                gender : gender,
                profilePicture : newImage,
                deleteProfilePicture : deleteProfilePicture

            }
        })
        toast.success("Your profile is updated")
        dispatch(reset())
        navigate('/profile')

    };


  return (
    <Box >
    <form onSubmit={handleSubmit} encType="multipart/form-data">    
    <Grid container m={5} spacing={2} flex={6} width="70%" p={2}>
      <Grid  item xs ={12} >
        <Grid item xs={6}>
        <Avatar
            alt="Profile Picture"
            src={deleteProfilePicture ? undefined : imageUrl}
            sx={{ width: 150, height: 150, margin: 4 }}
            />
        </Grid>
        <Grid item xs={6} >
        <Button
              sx={{mr:1, cursor:'pointer'}}
                  component="label"
                  variant="contained"
                  startIcon={<Delete />}
                  onClick={() => setDeleteProfilePicture(true)}
                >                 
        </Button>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<Upload />}
            
            >
            Upload Image
            <VisuallyHiddenInput 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            />
          </Button>
        </Grid>
      </Grid>
        
      <Grid item xs={6}>
        <TextField
          required
          id="username"
          label="username"
          variant="outlined"
          fullWidth
          value={updatedUserInfo.username || ''}
          onChange={handleInputChange}
          disabled
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          required
          id="email"
          label="email"
          variant="outlined"
          fullWidth
          value={updatedUserInfo.email || ''}
          disabled
        />
      </Grid>      
      <Grid item xs={3}>
        <TextField
          required
          id="first_name"
          label="First Name"
          variant="outlined"
          fullWidth
          value={updatedUserInfo.first_name || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          required
          id="last_name"
          label="Last Name"
          variant="outlined"
          fullWidth
          value={updatedUserInfo.last_name || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} lg ={6}>
        <TextField
          
          id="mobile"
          label="Mobile"
          variant="outlined"
          fullWidth
          value={updatedUserInfo.mobile || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} >
        <TextField
          
          id="bio"
          label="Bio"
          variant="outlined"
          fullWidth
          value={updatedUserInfo.bio || ''}
          onChange={handleInputChange}
          rows={4}
          multiline
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          
          id="date_joined"
          label="Date Joined"
          variant="outlined"
          fullWidth
          value={updatedUserInfo.date_joined || ''}
          disabled 
        />
      </Grid>
      <Grid item xs={3}>
        {/* <FormControl component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
            row
            aria-label="gender"
            name="gender"
            id="gender"
            value={updatedUserInfo.gender || ''}
            onChange={handleInputChange}
            >
            <FormControlLabel 
                value="male" 
                control={<Radio checked={updatedUserInfo.gender === 'male'} />} label="Male" />
            <FormControlLabel 
                value="female" 
                control={<Radio checked={updatedUserInfo.gender === 'female'} />} label="Female" />
            </RadioGroup>
        </FormControl> */}
        <FormControl>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
                id = "gender"
                // defaultValue="female"
                name="controlled-radio-buttons-group"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                sx={{ my: 1 }}
            >
                <Radio value="female" label="Female" />
                <Radio value="male" label="Male" />
            </RadioGroup>
        </FormControl>
      </Grid>
    <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
            <Button
            variant="contained"
            color="primary"
            onClick={(e) => navigate('/profile')}
            >
            Cancel
            </Button>
        </Grid>
        <Grid item>
            <Button
            type="submit"
            variant="contained"
            color="primary"
            >
            Update Details
            </Button>
        </Grid>
        </Grid>
    </Grid>
    </form>    
    </Box>
  )
}

export default ProfileEdit