import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axiosConfig';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      setUser({ email: userData.email });
      window.location.href = '/'; // Force full reload to reset state and redirect to home
    } catch (err) {
      alert("Wrong attempt! This email or username might already be taken.");
      console.log("Registration Failed");
    }
  };

  const onSubmit = (data) => handleRegister(data);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#121212', 
      py: 8, 
      background: 'linear-gradient(to bottom, #1db95422, #121212)' 
    }}>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1, textAlign: 'center' }}>
            Sign up for free to start listening.
          </Typography>
          
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4, width: '100%' }}>
            
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>What's your email?</Typography>
            <TextField
              fullWidth
              placeholder="Enter your email"
              {...register("email", { 
                required: "Email is required", 
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } 
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={inputStyles}
            />

            <Typography variant="subtitle2" sx={{ color: 'white', mt: 3, mb: 1, fontWeight: 'bold' }}>Create a password</Typography>
            <TextField
              fullWidth
              type="password"
              placeholder="Create a password"
              {...register("password", { 
                required: "Password is required", 
                minLength: { value: 6, message: "Password must be at least 6 characters" } 
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={inputStyles}
            />

            <Typography variant="subtitle2" sx={{ color: 'white', mt: 3, mb: 1, fontWeight: 'bold' }}>What should we call you?</Typography>
            <TextField
              fullWidth
              placeholder="Enter a profile name"
              {...register("username", { required: "Username is required" })}
              error={!!errors.username}
              helperText={errors.username?.message}
              sx={inputStyles}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={buttonStyles}
            >
              SIGN UP
            </Button>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography sx={{ color: '#b3b3b3', fontSize: '14px' }}>
                Have an account?{' '}
                <Link href="/login" sx={{ color: 'white', fontWeight: 'bold', textDecoration: 'none', '&:hover': { color: '#1db954' } }}>
                  Log in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// Reusing the same styles from Login for consistency
const inputStyles = {
    bgcolor: '#121212',
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': { borderColor: '#727272' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: '#1db954' },
    },
    '& .MuiFormHelperText-root': { color: '#f15e6c' }
};

const buttonStyles = {
    mt: 4,
    py: 1.5,
    borderRadius: '30px',
    bgcolor: '#1DB954',
    fontWeight: 'bold',
    fontSize: '16px',
    '&:hover': { bgcolor: '#1ed760' }
};