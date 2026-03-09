import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SongGrid from '../components/SongGrid';

export default function PlaylistDetail({ playlists, onSelect, likedIds, onToggleLike, onAddToPlaylist, isLikedView }) {
  const { id } = useParams();
  
  // Logic: Are we looking at the 'Liked Songs' collection or a custom one?
  const playlist = isLikedView 
    ? playlists.find(p => p.name === "Liked Songs")
    : playlists.find(p => p.id?.toString() === id);

  // Fallback for empty 'Liked Songs'
  const displayTitle = isLikedView ? "Liked Songs" : (playlist?.name || "Playlist");
  const displaySongs = playlist?.tracks || [];

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, mb: 5 }}>
        <Box sx={{ 
          width: 232, height: 232, 
          background: isLikedView ? 'linear-gradient(135deg, #450af5, #c4efd9)' : '#282828',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 3 
        }}>
           {isLikedView ? <FavoriteIcon sx={{ fontSize: 100, color: 'white' }} /> : <Typography variant="h1">{displayTitle[0]}</Typography>}
        </Box>
        <Box>
          <Typography variant="caption" fontWeight="bold">PLAYLIST</Typography>
          <Typography variant="h1" sx={{ fontWeight: 900, fontSize: '4.5rem', mt: -1 }}>{displayTitle}</Typography>
          <Typography variant="body2" color="text.secondary">{displaySongs.length} songs</Typography>
        </Box>
      </Box>

      {displaySongs.length > 0 ? (
        <SongGrid 
          songs={displaySongs} 
          onSelect={(song) => onSelect(song, displaySongs)}
          playlists={playlists}
          likedIds={likedIds}
          onToggleLike={onToggleLike}
          onAddToPlaylist={onAddToPlaylist}
        />
      ) : (
        <Typography sx={{ color: '#b3b3b3', mt: 5 }}>This playlist is empty.</Typography>
      )}
    </Container>
  );
}