import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Switch,
  Box,
  Typography,
  styled,
  useTheme,
  useMediaQuery,
  Input,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import {  useMutation,gql, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { CREATE_POST_MUTATION } from '../../Graphql/GraphqlMutation'
import { POST_QUERY } from '../../Graphql/GraphqlQuery'


const InputWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(2),
}));

const PreviewContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  marginBottom: theme.spacing(2),
  width: '100%',
  maxWidth: '400px',
  overflow: 'auto',
}));

const PreviewItem = styled('div')(({ theme }) => ({
  width: '100px',
  height: '100px',
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  position: 'relative',
  overflow: 'hidden',
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});



export default function CreatePostMutation() {


  const [open, setOpen] = useState(true);
  const [date, setDate] = useState(null);
  const [description,setDescription] = useState("")
  const [previews, setPreviews] = useState();
  const [switchValue, setSwitchValue] = useState(false);
  const [files, setFiles] = useState();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate()

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [createPostMutation, { loading, error, data }] = useMutation(CREATE_POST_MUTATION);
  const {refetch:postRefetch} = useQuery(POST_QUERY)

  if (error) {
    if (error.message === "User is not active") {
      navigate('/login')
    }
    toast.error(error.message,{ toastId: 'errorMessage' });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate(-1)
  };


  const handleInputChange = (e) => {
    const newFile = e.target.files[0]
    const reader = new FileReader() 

    reader.onload = (e) => {
      const base64Image = reader.result.split(',')[1];
      setFiles(base64Image)
      setPreviews(URL.createObjectURL(newFile))
    }
    reader.onerror = (error) => {
      console.error("Error reading image file:", error);
    };
  
    reader.readAsDataURL(newFile);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true)
    
    try {

      if (!files) {
        toast.error('Please select an image to upload');
        return;
      }
      

      handleClose();
 
      const response = await createPostMutation({
        variables: {
          description,
          image:files,
          privacySettings: switchValue,
          dateOfMemory: date,
          
        },
      });
      postRefetch()
      if(response.data.createPost.success){
        toast.success("your post uploaded")
      }
      
      setOpen(false);
      setDate(null);
      setDescription('');
      setPreviews();
      setSwitchValue(false);
      setFiles();
      
      setTimeout(() => {
        setUploading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 1500);
      }, 500);
    } catch (error) {
      console.error('Error creating post * * * :', error);
    }
  };
  

  return (
    <React.Fragment>
        {loading && uploading && 'Uploading...'}
        { data?.success && success && 'Post uploaded successfully...'}
        <form onSubmit={handleSubmit} encType="multipart/form-data">  
        {/* <Button variant="outlined" onClick={handleClickOpen}>
            Open responsive dialog
        </Button> */}
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            fullWidth
        >
            <DialogTitle id="responsive-dialog-title">
            {"Post"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText>
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
                    checked={switchValue}
                    onChange={() => setSwitchValue(!switchValue)}
                    />
                </Box>
                <Typography variant="body1">
                    {switchValue ? 'Friends' : 'Everyone'}
                </Typography>
                </InputWrapper>
                <PreviewContainer>             
                    <PreviewItem >
                    <PreviewImage src={previews}  />
                    </PreviewItem>             
                {/* <PreviewImage src={previews} alt=''/> */}
                </PreviewContainer>
                <input
                  
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="file-input"
                  type="file"
                  onChange={handleInputChange}
                />
                <label htmlFor="file-input">
                <Button variant="contained" component="span">
                    Upload
                </Button>
                </label>
                <TextField
                id="description"
                label="description.."
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                multiline
                sx={{
                    mt: 1,
                }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Memory date"
                    value={date}
                    onChange={(newValue) => {
                      if (newValue !== null) {
                        const formattedDate = dayjs(newValue).format("YYYY/MM/DD");
                        setDate(formattedDate);
                      }
                    }}
                    views={['year', 'month', 'day']}
                    inputFormat="YYYY/MM/DD"
                    slotProps={{
                    textField: {
                        size: 'small',
                    },
                    }}
                    sx={{
                    mt: 1,
                    }}
                />
                </LocalizationProvider>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} autoFocus>
                cancel
            </Button>
            <Button autoFocus onClick={handleSubmit}>
                Create
            </Button>
            </DialogActions>
        </Dialog>
        </form>
    </React.Fragment>
  );
}