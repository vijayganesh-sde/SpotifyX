import { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Typography, CircularProgress, Box } from '@mui/material';
import SongGrid from '../components/SongGrid';
import API from '../api/axiosConfig';

export default function Home({ playlists, onAddToPlaylist, onSelect, likedIds, onToggleLike, isLikedView, likedSongs }) {
  const [songs, setSongs] = useState([]);
  const [language, setLanguage] = useState('Tamil');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // We only fetch if we are NOT in the "Liked Songs" view
    if (!isLikedView) {
      const fetchSongs = async () => {
        setLoading(true);
        try {
          const response = await API.get(`/tracks?language=${language}`);
          // Ensure we are setting an array even if backend returns null
          console.log(Array.isArray(response.data));
          setSongs(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error("Failed to fetch songs:", error);
          setSongs([]); // Clear songs on error to show the "No songs" message
        } finally {
          setLoading(false);
        }
      };
      fetchSongs();
    }
  }, [language, isLikedView]);

  // Determine what to display
  const currentList = isLikedView ? (likedSongs || []) : songs;

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
        {isLikedView ? 'Liked Songs' : 'Welcome to SpotifyX'}
      </Typography>

      {!isLikedView && (
        <Tabs 
          value={language} 
          onChange={(e, v) => setLanguage(v)} 
          sx={{ mb: 4, '& .MuiTab-root': { color: '#b3b3b3' }, '& .Mui-selected': { color: 'white !important' } }}
        >
          {['Tamil', 'Hindi', 'English', 'Telugu', 'Malayalam'].map(lang => (
            <Tab key={lang} label={lang} value={lang} />
          ))}
        </Tabs>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress sx={{ color: '#1DB954' }} />
        </Box>
      ) : currentList.length > 0 ? (
        <SongGrid
          playlists={playlists || []} 
          onAddToPlaylist={onAddToPlaylist}
          songs={currentList} 
          onSelect={(song) => onSelect(song, currentList)} 
          likedIds={likedIds || []} 
          onToggleLike={onToggleLike}
        />
      ) : (
        <Typography sx={{ color: '#b3b3b3', textAlign: 'center', mt: 10 }}>
          {isLikedView ? "You haven't liked any songs yet." : "No songs found for this language."}
        </Typography>
      )}
    </Container>
  );
}