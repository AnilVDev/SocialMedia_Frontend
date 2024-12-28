import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.css';
import './style.css'
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify'
import { register, reset } from "../../Slice/authSlice";
import Spinner from "../../components/Spinner";
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, CircularProgress, useMediaQuery } from '@mui/material';

function SignUpForm() {
    const [state, setState] = useState({
        first_name:"",
        last_name:"",
        username: "",
        email: "",
        password: "",
        re_password: "",
    });
    const [gender, setGender] = useState('');
    const [errorShown, setErrorShown] = useState(false);
    const isMediumScreen = useMediaQuery("(max-width:768px)");

  const { first_name, last_name, username, email, password, re_password } = state;
  
  const navigate = useNavigate();  
  const  dispatch = useDispatch();

  const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

  useEffect(() => {
    if(isError){
        toast.error(message)
    }
    if (isSuccess) {
      
      toast.success("An activation email has been sent to your email. Please check your email")
      navigate('/login')
    }
    dispatch(reset())
  }, [user, isError, isSuccess, message])

  const handleChange = evt => {
    const value = evt.target.value;
    if (value === '' || (/^[A-Za-z]/.test(value) && !/^\s/.test(value))) {
    setState({
      ...state,
      [evt.target.name]: value
    });
    setErrorShown(false);
    }else{
      if (!errorShown) {
        toast.error("Value should start with an alphabet and should not have leading spaces", { toastId: 'errorMessage' });
        setErrorShown(true);
      }
    }
  };
  const handleGenderChange = (evt) => {
    setGender(evt.target.value);
  };


  const handleOnSubmit = evt => {
    evt.preventDefault();

    if(password!=re_password){
        toast.error('Passwords do not match')
    }else{
        const userData = {
            first_name, 
            last_name, 
            username,
            email,
            password,
            re_password,
            gender
        }
        dispatch(register(userData))
        
    }
  };

  return (


<Box
  sx={{
    textAlign: "center",
    fontFamily: "Montserrat, sans-serif",
    backgroundColor: "#f6f5f7",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: isMediumScreen ? "column" : "row", // Stack vertically on small screens
    overflow: "visible", // Ensure that no content is clipped
  }}
>
  <Box
    sx={{
      width: "100%",
      maxWidth: 768,
      minHeight: 480,
      backgroundColor: "#fff",
      borderRadius: 2,
      boxShadow: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
      display: "flex",
      flexDirection: isMediumScreen ? "column" : "row",
      overflow: "visible", // Ensure no content is clipped in column view
      position: "relative",
    }}
  >
    {/* Sign-Up Container */}
    <Box
      sx={{
        width: isMediumScreen ? "100%" : "50%",
        background: "linear-gradient(to right, #ff4b2b, #ff416c)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: { xs: 3, sm: 4, md: 4 },
        order: isMediumScreen ? 1 : 0, // On small screens, Sign-Up comes first
        borderTopLeftRadius: isMediumScreen ? 2 : 2, // Keep top-left radius consistent
        borderTopRightRadius: isMediumScreen ? 2 : 2, // Keep top-right radius consistent
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          marginBottom: { xs: 1, sm: 1, md: 2 },
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, // Adjust font size for different screen sizes
        }}
      >
        Welcome Back!
      </Typography>
      <Typography
        sx={{
          fontWeight: 100,
          mb: { xs: 1, sm: 1, md: 2 },
          fontSize: { sm: '0.8rem', md: '1rem' }, // Adjust font size for different screen sizes
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        To keep connected with us please login with your personal info
      </Typography>

      <Button
        variant="outlined"
        sx={{
          mt: 2,
          px: 5,
          py: 1,
          borderRadius: 20,
          borderColor: "#fff",
          color: "#fff",
          textTransform: "uppercase",
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)", borderColor: "#fff" },
        }}
        onClick={() => navigate('/login')}
      >
        Sign In
      </Button>
    </Box>

    {/* Sign-Up Container */}
    <Box
      sx={{
        width: isMediumScreen ? "100%" : "50%",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        order: isMediumScreen ? 0 : 1, // On small screens, Sign-In comes second
        borderTopLeftRadius: isMediumScreen ? 2 : 2, // Keep top-left radius consistent
        borderTopRightRadius: isMediumScreen ? 2 : 2, // Keep top-right radius consistent
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: { sm: 1, md: 2 }, mt: 3 }}>
        Create Account
      </Typography>
      <form onSubmit={handleOnSubmit} style={{ width: "100%" }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            type="text"
            name="first_name"
            value={state.first_name}
            onChange={handleChange}
            placeholder="Firstname"
            fullWidth
            required
            sx={{
              backgroundColor: "#eee",
              borderRadius: 1,
              "& .MuiInputBase-root": { height: { xs: "35px", md: "40px" } },
            }}
          />
          <TextField
            type="text"
            name="last_name"
            value={state.last_name}
            onChange={handleChange}
            placeholder="Lastname"
            fullWidth
            required
            sx={{
              backgroundColor: "#eee",
              borderRadius: 1,
              "& .MuiInputBase-root": { height: { xs: "35px", md: "40px" } },
            }}
          />
        </Box>

        <TextField
          type="text"
          name="username"
          value={state.username}
          onChange={handleChange}
          placeholder="Username"
          fullWidth
          required
          sx={{
            mb: 2,
            backgroundColor: '#eee',
            borderRadius: 1,
            '& .MuiInputBase-root': { height: { xs: "35px", md: "40px" } }
          }}
        />

        <TextField
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
          fullWidth
          required
          sx={{
            mb: 2,
            backgroundColor: '#eee',
            borderRadius: 1,
            '& .MuiInputBase-root': { height: { xs: "35px", md: "40px" } },
          }}
        />

        <TextField
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          fullWidth
          required
          sx={{
            mb: 2,
            backgroundColor: '#eee',
            borderRadius: 1,
            '& .MuiInputBase-root': { height: { xs: "35px", md: "40px" } },
          }}
        />

        <TextField
          type="password"
          name="re_password"
          value={state.re_password}
          onChange={handleChange}
          placeholder="Confirm"
          fullWidth
          required
          sx={{
            mb: 2,
            backgroundColor: '#eee',
            borderRadius: 1,
            '& .MuiInputBase-root': { height: { xs: "35px", md: "40px" } },
          }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel sx={{ height: { xs: "35px", md: "40px" } }}>Gender</InputLabel>
          <Select
            value={gender}
            onChange={handleGenderChange}
            required
            sx={{
              backgroundColor: '#eee',
              borderRadius: 1,
              '& .MuiInputBase-root': { height: { xs: "35px", md: "40px" } },
            }}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: "20px",
            backgroundColor: "#ff4b2b",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: "bold",
            padding: "12px 45px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Sign Up
        </Button>

        {isLoading && <CircularProgress sx={{ mt: 2 }} />}
      </form>
    </Box>
  </Box>
</Box>




  );
}

export default SignUpForm;
