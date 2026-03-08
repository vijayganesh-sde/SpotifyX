import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  return (
    <Box sx={{ 
      height: '100vh', 
      background: 'linear-gradient(to bottom, #1db95433, #121212)',
      display: 'flex', flexDirection: 'column' 
    }}>
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1DB954' }}>SpotifyX</Typography>
      </Container>
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h1" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '3rem', md: '5rem' } }}>Music for everyone.</Typography>
        <Typography variant="h5" sx={{ color: '#b3b3b3', mb: 5 }}>Millions of songs. Start listening now.</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" size="large" onClick={() => navigate('/register')} sx={{ borderRadius: 10, px: 5, fontWeight: 'bold' }}>GET STARTED</Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/login')} sx={{ borderRadius: 10, px: 5, color: 'white', borderColor: '#b3b3b3' }}>LOG IN</Button>
        </Box>
      </Box>
    </Box>
  );
};
export default LandingPage;