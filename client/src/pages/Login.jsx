import React, { useContext, useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container, 
  Paper, 
  Avatar, 
  Link 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import API from '../api/axiosConfig';
export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const naviagte = useNavigate();
  const { setUser } = useContext(AuthContext);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleLogin = async (userData) => {
    try {
      const response = await API.post('/login', userData);
      localStorage.setItem('token', response.data.token);
      setUser({ email: userData.email }); // Set user context with email
      naviagte('/home'); // Redirect to Home after successful login

    } catch (error) {
      console.log("Login Failed");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Login Attempt:', formData);
    handleLogin(formData); // Call the async login function
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
