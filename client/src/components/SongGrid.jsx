import React, { useState } from 'react';
import { Box, Card, CardMedia, Typography, CardActionArea, IconButton, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function SongGrid({ 
  songs = [], 
  playlists = [], 
  onSelect, 
  currentTrackId, 
  likedIds = [], 
  onToggleLike, 
  onAddToPlaylist 
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const handleOpenMenu = (event, songId) => {
    event.stopPropagation(); // Stop the song from playing when clicking '+'
    setAnchorEl(event.currentTarget);
    setSelectedSongId(songId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSongId(null);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'flex-start' }}>
      {songs.map((song) => {
        const isLiked = likedIds.includes(song.id);
        const isActive = currentTrackId === song.id;

        return (
          <Card 
            key={song.id}
            sx={{ 
              width: 200, 
              bgcolor: '#181818', 
              borderRadius: 2, 
              position: 'relative',
              transition: '0.3s',
              border: isActive ? '1px solid #1DB954' : '1px solid transparent',
              '&:hover': { bgcolor: '#282828' },
              '&:hover .grid-actions': { opacity: 1 } 
            }}
          >
            {/* Action Buttons (Like & Add) */}
            <Box className="grid-actions" sx={{ 
              position: 'absolute', top: 8, right: 8, zIndex: 10, 
              display: 'flex', gap: 1, opacity: isLiked ? 1 : 0, transition: '0.2s' 
            }}>
              <IconButton 
                onClick={(e) => { e.stopPropagation(); onToggleLike(song); }}
                sx={{ bgcolor: 'rgba(0,0,0,0.6)', color: isLiked ? '#1DB954' : 'white', p: 0.5 }}
              >
                {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
              
              <IconButton 
                onClick={(e) => handleOpenMenu(e, song.id)}
                sx={{ bgcolor: 'rgba(0,0,0,0.6)', color: 'white', p: 0.5 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>

            <CardActionArea onClick={() => onSelect(song)}>
              <CardMedia
                component="img"
                image={song.image_url || song.imageUrl}
                sx={{ aspectRatio: '1/1', objectFit: 'cover', p: 1.5, borderRadius: 3 }}
              />
              <Box sx={{ p: 1.5, pt: 0 }}>
                <Typography variant="body2" fontWeight="bold" noWrap sx={{ color: 'white' }}>
                  {song.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#b3b3b3' }} noWrap>
                  {song.artist}
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        );
      })}

      {/* Playlist Selector Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{ sx: { bgcolor: '#282828', color: 'white', minWidth: 150 } }}
      >
        <Typography variant="caption" sx={{ p: 1.5, color: '#b3b3b3', display: 'block' }}>
          Add to Playlist
        </Typography>
        {playlists.length > 0 ? (
          playlists.map((pl) => (
            <MenuItem 
              key={pl.id} 
              onClick={() => {
                onAddToPlaylist(pl.id, selectedSongId);
                handleCloseMenu();
              }}
            >
              {pl.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No playlists found</MenuItem>
        )}
      </Menu>
    </Box>
  );
}