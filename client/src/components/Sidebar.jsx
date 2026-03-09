import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Badge } from '@mui/material';
import { Home as HomeIcon, Search as SearchIcon, Favorite as FavoriteIcon, LibraryMusic as LibraryMusicIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ likedCount, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Search', icon: <SearchIcon />, path: '/search' },
    { 
      text: 'Liked Songs', 
      icon: <FavoriteIcon />, 
      path: '/collection/tracks', 
      count: likedCount // 👈 Pass the prop here
    },
    { text: 'Your Library', icon: <LibraryMusicIcon />, path: '/collection/library' },
  ];

  return (
    <Box sx={{ 
      width: 240, bgcolor: '#000', height: '100vh', display: 'flex', 
      flexDirection: 'column', p: 2, borderRight: '1px solid #282828' 
    }}>
      <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 4, px: 2 }}>
        SpotifyX
      </Typography>

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={isSelected}
                sx={{ 
                  borderRadius: 2,
                  '&.Mui-selected': { bgcolor: '#282828', color: '#1DB954' },
                  '&.Mui-selected .MuiListItemIcon-root': { color: '#1DB954' },
                  color: isSelected ? 'white' : '#b3b3b3',
                  '&:hover': { color: 'white', bgcolor: '#1a1a1a' }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 45 }}>
                  {item.icon}
                </ListItemIcon>
                
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: 'bold' }} 
                />

                {/* --- LIKED COUNT LOGIC --- */}
                {item.text === 'Liked Songs' && likedCount > 0 && (
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: isSelected ? '#1DB954' : '#b3b3b3',
                      fontWeight: 'bold', marginRight: 2
                    }}
                  >
                    {likedCount}
                  </Typography>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ bgcolor: '#282828', my: 0 }} />

      <List>
        <ListItem>
          <ListItemButton 
            onClick={onLogout}
            sx={{ 
              borderRadius: 2, color: '#b3b3b3', 
              '&:hover': { color: '#ff4d4d', bgcolor: 'rgba(255, 77, 77, 0.1)' } 
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 45 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 'bold' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}