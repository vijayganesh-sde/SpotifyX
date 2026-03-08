import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import SongGrid from '../components/SongGrid';

export default function PlaylistDetail({ playlists, onSelect, likedIds, onToggleLike, onAddToPlaylist }) {
  const { id } = useParams();
  
  // Find the playlist from the shared state
  const playlist = playlists.find(p => p.id.toString() === id);

  if (!playlist) return <Typography sx={{ color: 'white', p: 4 }}>Playlist not found</Typography>;

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, mb: 5 }}>
        <Box sx={{ width: 232, height: 232, bgcolor: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 3 }}>
          <Typography variant="h2">{playlist.name[0].toUpperCase()}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" fontWeight="bold">PLAYLIST</Typography>
          <Typography variant="h1" sx={{ fontWeight: 900, fontSize: '4.5rem', mt: -1 }}>{playlist.name}</Typography>
          <Typography variant="body2" color="text.secondary">{playlist.tracks?.length || 0} songs</Typography>
        </Box>
      </Box>

      <SongGrid 
        songs={playlist.tracks || []} 
        onSelect={(song) => onSelect(song, playlist.tracks)}
        playlists={playlists}
        likedIds={likedIds}
        onToggleLike={onToggleLike}
        onAddToPlaylist={onAddToPlaylist}
      />
    </Container>
  );
}