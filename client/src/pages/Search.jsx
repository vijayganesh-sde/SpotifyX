import { useState, useEffect, useMemo } from 'react';
import { Container, TextField, Box, Typography, Grid, Paper, Avatar, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon} from '@mui/icons-material';
import SongGrid from '../components/SongGrid';
import { fuzzySearch } from '../utils/SearchLogic';
import useDebounce from '../hooks/useDebounce';
import API from '../api/axiosConfig';


export default function Search({ onSelect, playlists, likedIds, onToggleLike, onAddToPlaylist }) {
  const [allSongs, setAllSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load all 1000 songs once for client-side fuzzy searching
  useEffect(() => {
    API.get('/tracks').then(res => {
      console.log(res.data);
      setAllSongs(res.data);
    });
  }, []);

  // Logic to group songs by Artist for the "Browse" view
  const categorizedArtists = useMemo(() => {
    const map = {};
    allSongs.forEach(song => {
      if (!map[song.artist]) {
        let artists = [song.artist];
        if (song.artist.includes(',')) {
          artists = song.artist.split(',')
        }
        else{
          artists = song.artist.split('&')
        }
        map[artists[0].trim()] = song.image_url || song.imageUrl;
      }
    });
    return Object.entries(map).slice(0, 20); // Limit to top 20 artists for performance
  }, [allSongs]);

  // Optimized Filtering: Only recalculate when the DEBOUNCED term changes
  const filteredResults = useMemo(() => {
    if (!debouncedSearchTerm) return [];
    
    console.log("Algorithm running for:", debouncedSearchTerm); // Verify it's not running every keystroke
    return fuzzySearch(debouncedSearchTerm, allSongs);
  }, [debouncedSearchTerm, allSongs]);

  return (
    <Container maxWidth="xl" sx={{ pt: 4, pb: 10 }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#121212', pb: 3 }}>
        <TextField
          fullWidth
          placeholder="What do you want to listen to?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'black' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm('')} size="small">
                  <ClearIcon sx={{ color: 'black' }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: { bgcolor: 'white', borderRadius: 10, px: 2, color: 'black' }
          }}
        />
      </Box>

      {searchTerm ? (
        /* SEARCH RESULTS VIEW */
        <Box>
          <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>Best Results</Typography>
          <SongGrid 
            playlists={playlists || []} 
            onAddToPlaylist={onAddToPlaylist}
            songs={filteredResults} 
            onSelect={(song) => onSelect(song, filteredResults)} 
            likedIds={likedIds || []} 
            onToggleLike={onToggleLike}
          />
        </Box>
      ) : (
        /* CATEGORIZED BROWSE VIEW */
        <Box >
          <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>Browse by Artist</Typography>
          <Grid container spacing={2} display="flex" justifyContent="center" flexWrap="wrap" rowGap={13} columnGap={2}>
            {categorizedArtists.map(([artistName, artistImg]) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={artistName} width={250} height={220}>
                <Paper 
                  onClick={() => setSearchTerm(artistName)}
                  sx={{
                    p: 2, bgcolor: '#282828', borderRadius: 2, cursor: 'pointer',
                    transition: '0.3s', '&:hover': { bgcolor: '#3E3E3E', transform: 'translateY(-5px)' }
                  }}
                >
                  <Avatar 
                    src={artistImg} 
                    sx={{ width: '100%', height: 'auto', aspectRatio: '1/1', mb: 2, borderRadius: 2, boxShadow: 4 }} 
                  />
                  <Typography variant="body1" fontWeight="bold" sx={{ color: 'white' }} noWrap>
                    {artistName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b3b3b3' }}>Artist</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}