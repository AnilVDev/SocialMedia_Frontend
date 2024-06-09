import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, TextField, Box, Typography, Container, Grid, InputAdornment, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import { CHANGE_PASSWORD_MUTATION } from '../../Graphql/GraphqlMutation';
import { set } from 'date-fns';
import { useNavigate } from 'react-router';
import { Visibility, VisibilityOff } from '@mui/icons-material';



function ChangePassword(){
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassword, { data, loading, error }] = useMutation(CHANGE_PASSWORD_MUTATION);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate()  


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (oldPassword == newPassword){
        toast("old password and new password are same")
        setNewPassword('')
        setConfirmPassword('')
        return;
    }
    if (newPassword !== confirmPassword) {
      toast("Passwords doesn't match");
      setNewPassword('')
      setConfirmPassword('')
      return;
    }
    try {
      await changePassword({
        variables: {
          oldPassword,
          newPassword
        }
      });
      if (data?.changePassword?.success) {
        navigate(-1)
        toast('Password changed successfully');
      } else {
        toast(data?.changePassword?.message || 'Error changing password');
      }
    } catch (e) {
      console.error(e);
      toast('Error changing password');
    }
  };

  if (error) {
    if (error.message === "User is not active" || error.message === "Invalid token or user not found") {
      navigate('/login')
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="oldPassword"
                label="Old Password"
                type={showOldPassword ? 'text' : 'password'}
                id="oldPassword"
                autoComplete="current-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          edge="end"
                        >
                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
  
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
              disabled={loading}
            >
              Save
            </Button>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              color="secondary"
              sx={{ ml: 1 }}
              onClick={() => {
                navigate(-1) 
              }}
            >
              Cancel
            </Button>
          </Box>
          {error && <Typography color="error">{error.message}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default ChangePassword;
