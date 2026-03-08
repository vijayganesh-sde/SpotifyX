import { Container, Grid, Card, Typography, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreatePlaylistModal from '../components/CreatePlaylistModal';

export default function Library({ likedCount, onCreatePlaylist, playlists = [] }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>
        Your Library
      </Typography>

      <Grid container spacing={3}>
        {/* 1. Static Liked Songs Card */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #450af5 0%, #c4efd9 100%)', height: '100%' }}>
            <CardActionArea 
              onClick={() => navigate('/collection/tracks')}
              sx={{ p: 3, height: '100%', minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}
            >
              <FavoriteIcon sx={{ fontSize: 60, color: 'white', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>Liked Songs</Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>{likedCount} songs</Typography>
            </CardActionArea>
          </Card>
        </Grid>

        {/* 2. Dynamic Playlists from DB */}
        {playlists.map((playlist) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={playlist.id}>
            <Card sx={{ background: 'linear-gradient(135deg, #757373 0%, #e3eeef 100%)', height: '100%' }}>
              <CardActionArea onClick={() => navigate(`/playlist/${playlist.id}`)} sx={{ p: 3, height: '100%', minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }} noWrap>
                  {playlist.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'white' }}>
                  {playlist.tracks?.length || 0} songs
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

        {/* 3. Create Playlist Button */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ bgcolor: '#121212', color: '#b3b3b3', border: '1px dashed #333', height: '100%' }}>
            <CardActionArea onClick={() => setModalOpen(true)} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <AddCircleIcon sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="body1" fontWeight="bold">Create Playlist</Typography>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      <CreatePlaylistModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onCreate={onCreatePlaylist} 
      />
    </Container>
  );
}