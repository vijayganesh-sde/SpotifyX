import { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Typography, CircularProgress, Box } from '@mui/material';
import SongGrid from '../components/SongGrid';
import API from '../api/axiosConfig';

export default function Home({ 
  playlists, 
  onAddToPlaylist, 
  onSelect, 
  likedIds, 
  onToggleLike 
}) {
  const [songs, setSongs] = useState([]);
  const [language, setLanguage] = useState('Tamil');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/tracks?language=${language}`);
        // Log to verify data structure coming from Spring Boot
        console.log("Fetched songs:", response.data);
        setSongs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [language]);

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
        Welcome to SpotifyX
      </Typography>

      <Tabs 
        value={language} 
        onChange={(e, v) => setLanguage(v)} 
        sx={{ 
          mb: 4, 
          '& .MuiTab-root': { color: '#b3b3b3' }, 
          '& .Mui-selected': { color: 'white !important' },
          '& .MuiTabs-indicator': { bgcolor: '#1DB954' }
        }}
      >
        {['Tamil', 'Hindi', 'English', 'Telugu', 'Malayalam'].map(lang => (
          <Tab key={lang} label={lang} value={lang} />
        ))}
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress sx={{ color: '#1DB954' }} />
        </Box>
      ) : songs.length > 0 ? (
        <SongGrid
          playlists={playlists || []} 
          onAddToPlaylist={onAddToPlaylist}
          songs={songs} 
          onSelect={(song) => onSelect(song, songs)} 
          likedIds={likedIds || []} 
          onToggleLike={onToggleLike}
        />
      ) : (
        <Typography sx={{ color: '#b3b3b3', textAlign: 'center', mt: 10 }}>
          No songs found for this language.
        </Typography>
      )}
    </Container>
  );
}