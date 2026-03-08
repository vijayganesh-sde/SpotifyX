import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { Home as HomeIcon, Search as SearchIcon, Favorite as FavoriteIcon, LibraryMusic as LibraryMusicIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ likedCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Search', icon: <SearchIcon />, path: '/search' },
    { text: 'Liked Songs', icon: <FavoriteIcon />, path: '/collection/tracks', color: '#1DB954' },
    { text: 'Your Library', icon: <LibraryMusicIcon />, path: '/collection/library' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        '& .MuiDrawer-paper': { width: 240, bgcolor: '#000', color: '#b3b3b3', borderRight: '1px solid #282828' },
      }}
    >
      <Box sx={{ p: 3, color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>SpotifyX</Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
            sx={{ 
              color: location.pathname === item.path ? 'white' : 'inherit',
              '&:hover': { color: 'white' }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? (item.color || 'white') : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
            {item.text === 'Liked Songs' && (
              <Typography variant="caption" sx={{ ml: 'auto' }}>{likedCount}</Typography>
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}