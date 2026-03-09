import { Box, Typography, Button, Container, Grid, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: <SearchIcon sx={{ fontSize: 40, color: '#1DB954' }} />, title: "Smart Discovery", desc: "Weighted fuzzy search to find any track instantly." },
    { icon: <LibraryMusicIcon sx={{ fontSize: 40, color: '#1DB954' }} />, title: "Custom Playlists", desc: "Organize your music exactly the way you want it." },
    { icon: <FavoriteIcon sx={{ fontSize: 40, color: '#1DB954' }} />, title: "Liked Collection", desc: "Keep your favorites synced across all devices." },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#121212',
      color: 'white',
      overflowX: 'hidden'
    }}>
      {/* 1. Glassmorphic Header */}
      <Box sx={{ 
        position: 'fixed', top: 0, width: '100%', zIndex: 1000,
        backdropFilter: 'blur(10px)', bgcolor: 'rgba(18, 18, 18, 0.7)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Container maxWidth="lg" sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#1DB954', letterSpacing: -1 }}>
            SpotifyX
          </Typography>
          <Button 
            variant="text" 
            onClick={() => navigate('/login')} 
            sx={{ color: 'white', fontWeight: 'bold', '&:hover': { color: '#1DB954' } }}
          >
            LOG IN
          </Button>
        </Container>
      </Box>

      {/* 2. Hero Section with Mesh Gradient */}
      <Box sx={{ 
        pt: 20, pb: 15,
        background: 'radial-gradient(circle at 50% -20%, #1db95433 0%, #121212 70%)',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ 
            fontWeight: 900, mb: 2, 
            fontSize: { xs: '3.5rem', md: '6rem' },
            lineHeight: 1.1,
            background: 'linear-gradient(to bottom, #ffffff, #b3b3b3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Music for <br /> everyone.
          </Typography>
          <br />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/register')} 
              sx={{ 
                bgcolor: '#1DB954', color: 'black', borderRadius: 10, px: 6, py: 2, 
                fontWeight: 900, fontSize: '1.1rem',
                '&:hover': { bgcolor: '#1ed760', transform: 'scale(1.05)' },
                transition: '0.3s'
              }}
            >
              GET STARTED FREE
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* 3. Features Grid (The "Resume Flex") */}
      <Container maxWidth="lg" sx={{ pb: 15 }}>
        <Grid container spacing={4} display="flex" justifyContent="center">
          {features.map((f, i) => (
            <Grid item xs={12} md={4} key={i} width={350} height={200}>
              <Paper sx={{ 
                p: 4, bgcolor: '#181818', borderRadius: 4, height: '100%',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: '0.3s',
                '&:hover': { borderColor: '#1DB954', transform: 'translateY(-10px)', bgcolor: '#282828' }
              }}>
                <Box sx={{ mb: 2 }}>{f.icon}</Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: 'white' }}>{f.title}</Typography>
                <Typography variant="body2" sx={{ color: '#b3b3b3', lineHeight: 1.6 }}>{f.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 4. Footer */}
      <Box sx={{ py: 6, textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Typography variant="caption" sx={{ color: '#535353' }}>
          © 2026 SpotifyX. Created with React & Spring Boot.
        </Typography>
      </Box>
    </Box>
  );
}