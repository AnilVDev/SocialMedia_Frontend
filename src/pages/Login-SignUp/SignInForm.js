import React, { useState,useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.css';
// import './style.css'
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo, login,reset } from "../../Slice/authSlice";
import { toast } from 'react-toastify'
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { Box, Button, TextField, Typography, useMediaQuery, CircularProgress, Grid } from "@mui/material";

function SignInForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMediumScreen = useMediaQuery("(max-width:768px)");

  const [state, setState] = useState({
    email: "anildevvin@gmail.com",
    password: "asdf@321"
});
  const { email, password } = state;

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
        toast.error(message)
        
      }
  
      if (isSuccess || (user && user.is_active)) {
        navigate('/')
      }
      dispatch(reset())
      dispatch(getUserInfo())
  }, [user, isError, isSuccess, message])

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const userData = {
        email,
        password,
    }

    dispatch(login(userData))
  };

  return (

<Box sx={{ textAlign: "center", fontFamily: "Montserrat, sans-serif", backgroundColor: "#f6f5f7", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{
        width: "100%",
        maxWidth: 768,
        minHeight: 480,
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
        display: "flex",
        flexDirection: isMediumScreen ? "column" : "row",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Sign-in Container */}
        <Box sx={{
          width: isMediumScreen ? "100%" : "50%",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginTop: 4 }}>Sign In</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              For testing, use the pre-filled email and password below.
            </Typography>
          <form onSubmit={handleOnSubmit} style={{ width: "100%" }}>
          <TextField
            type="email"
            placeholder="Email"
            name="email"
            value={state.email}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              mb: 2,
              backgroundColor: "#eee",
              borderRadius: 1,
              "& .MuiInputBase-root": {
                height: "50px", // Set your desired height
              },
            }}
          />

            <TextField
              type="password"
              name="password"
              placeholder="Password"
              value={state.password}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                mb: 2,
                backgroundColor: "#eee",
                borderRadius: 1,
                "& .MuiInputBase-root": {
                  height: "50px", // Set your desired height
                },
              }}
            />

            <Typography>
              <Link to="/forgot-password" style={{ textDecoration: "none", color: "#333" }}>Forgot your password?</Link>
            </Typography>
            <Button type="submit" variant="contained" sx={{
              mt: 2, px: 5, py: 1, borderRadius: 20, backgroundColor: "#ff4b2b", "&:hover": { backgroundColor: "#ff4b2b" },
              fontWeight: "bold", textTransform: "uppercase"
            }}>Sign In</Button>
            {isLoading && <CircularProgress size={24} sx={{ marginTop: 2 }} />}
          </form>
        </Box>

        {/* Overlay */}
        <Box sx={{
          width: isMediumScreen ? "100%" : "50%",
          background: "linear-gradient(to right, #ff4b2b, #ff416c)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: 4
        }}>
          <Typography variant="h4" 
          sx={{ fontWeight: "bold", marginBottom: { xs: 1, sm: 1, md: 2 }, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, }}>
            Hello, Friend!
            </Typography>
          <Typography 
          sx={{ fontWeight: 100, mb: { xs: 1, sm: 1, md: 2 }, textAlign: "center", lineHeight: 1.5,fontSize: { sm: '0.8rem', md: '1rem' }}}>
            Enter your personal details and start your journey with us
          </Typography>
          <Button
            variant="outlined"
            sx={{
              mt: 2, px: 5, py: 1, borderRadius: 20, borderColor: "#fff", color: "#fff", textTransform: "uppercase",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)", borderColor: "#fff" }
            }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Box>


  );
}

export default SignInForm;
