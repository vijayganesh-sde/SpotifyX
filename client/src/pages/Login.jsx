import React, { useContext, useState } from 'react';
import { TextField, Button, Typography, Box, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axiosConfig';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (userData) => {
    try {
      const response = await API.post('/auth/login', userData);
      localStorage.setItem('token', response.data.token);
      setUser({ email: userData.email });
      window.location.href = '/'; // Force full reload to reset state and redirect to home
    } catch (error) {
      alert("Wrong attempt! Please check your credentials.");
      console.log("Login Failed");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(formData);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#121212', 
      display: 'flex', 
      alignItems: 'center', 
      background: 'linear-gradient(to bottom, #1db95422, #121212)' 
    }}>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 4 }}>
            Log in to SpotifyX
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>Email address</Typography>
            <TextField
              required
              fullWidth
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              sx={inputStyles}
            />
            
            <Typography variant="subtitle2" sx={{ color: 'white', mt: 2, mb: 1, fontWeight: 'bold' }}>Password</Typography>
            <TextField
              required
              fullWidth
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              sx={inputStyles}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={buttonStyles}
            >
              LOG IN
            </Button>
            
            <Box sx={{ borderTop: '1px solid #282828', mt: 4, pt: 3, textAlign: 'center' }}>
              <Typography sx={{ color: '#b3b3b3', fontSize: '14px' }}>
                Don't have an account?{' '}
                <Link href="/register" sx={{ color: 'white', fontWeight: 'bold', textDecoration: 'none', '&:hover': { color: '#1db954' } }}>
                  Sign up for SpotifyX
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// Common styles to keep code clean
const inputStyles = {
  bgcolor: '#121212',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': { borderColor: '#727272' },
    '&:hover fieldset': { borderColor: 'white' },
    '&.Mui-focused fieldset': { borderColor: '#1db954' },
  },
  '& input': { padding: '12px' }
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