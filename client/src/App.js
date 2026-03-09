import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';

// API Configuration
import API from './api/axiosConfig';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Private Pages
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import Search from './pages/Search';

export default function App() {
  // --- 1. AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  // --- 2. GLOBAL MUSIC & PLAYLIST STATE ---
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]); // The list of songs currently in the player
  const [playlists, setPlaylists] = useState([]); // All playlists from DB (including Liked Songs)

  // --- 3. DATABASE SYNC ---
  // Fetch playlists whenever the user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaylists();
    }
  }, [isAuthenticated]);

  const fetchPlaylists = async () => {
    try {
      const response = await API.get('/playlists');
      setPlaylists(response.data);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    }
  };

  // --- 4. DERIVED STATE (LIKED SONGS) ---
  // We find the 'Liked Songs' playlist in our array to get the count and the IDs
  const likedPlaylist = useMemo(() => 
    playlists.find(p => p.name === "Liked Songs"), 
  [playlists]);

  const likedIds = useMemo(() => 
    likedPlaylist ? likedPlaylist.tracks.map(s => s.id) : [], 
  [likedPlaylist]);

  // --- 5. ACTION HANDLERS ---
  const handleCreatePlaylist = async (name) => {
    try {
      const res = await API.post('/playlists', { name });
      setPlaylists([...playlists, res.data]);
    } catch (err) {
      console.error("Error creating playlist:", err);
    }
  };

  const addTrackToPlaylist = async (playlistId, trackId) => {
    try {
      await API.post(`/playlists/${playlistId}/add/${trackId}`);
      fetchPlaylists(); // Refresh state
    } catch (err) {
      console.error("Error adding to playlist:", err);
    }
  };

  const toggleLike = async (song) => {
  try {
    console.log("Toggling like for song ID:", song.id);
    const response = await API.post(`/playlists/toggle-like/${song.id}`);
    
    console.log("Response from DB:", response.data);
    
    // Refresh playlists immediately
    const refreshRes = await API.get('/playlists');
    setPlaylists(refreshRes.data);
  } catch (err) {
    // This will tell us if it's a 403 (Security) or 500 (Java Error)
    console.error("Failed to toggle like. Status:", err.response?.status);
    console.error("Error Detail:", err.response?.data);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    alert("Successfully logged out!");
    window.location.href = '/landing';
  };

  return (
    <Router>
      <Box sx={{ 
          display: 'flex', 
          bgcolor: '#000', 
          height: '100vh', 
          width: '100vw', 
          overflow: 'hidden' 
        }}>
          
          {/* 1. SIDEBAR: Stays full height (100vh) and is never covered */}
          {isAuthenticated && (
            <Box sx={{ width: 240, flexShrink: 0, height: '100vh', zIndex: 1200 }}>
              <Sidebar likedCount={likedIds.length} onLogout={handleLogout} />
            </Box>
          )}
  
      {/* 2. MAIN AREA: Wrapper for Content + Player */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh', 
          position: 'relative',
          bgcolor: '#121212'
        }}
      >
        {/* SCROLLABLE CONTENT */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 3, 
            // Create space at the bottom so songs aren't hidden by the player
            pb: currentTrack ? '110px' : '20px' 
          }}
        >
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/landing" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/" />} />
            <Route path="/login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
            <Route path="/register" element={<Register />} />

            {/* PRIVATE ROUTES */}
            <Route path="/" element={
              isAuthenticated ? (
                <Home
                  playlists={playlists}
                  onAddToPlaylist={addTrackToPlaylist} 
                  onSelect={(song, list) => { setCurrentTrack(song); setCurrentPlaylist(list); }} 
                  likedIds={likedIds}
                  onToggleLike={toggleLike}
                />
              ) : <Navigate to="/landing" />
            } />
            <Route path="/search" element={
                <Search 
                  playlists={playlists}
                  onSelect={(song, list) => { setCurrentTrack(song); setPlaylists(list); }} 
                  likedIds={likedIds}
                  onToggleLike={toggleLike}
                  onAddToPlaylist={addTrackToPlaylist}
                />
              } />
            {/* LIKED SONGS: Uses PlaylistDetail with a special flag */}
            <Route path="/collection/tracks" element={
              isAuthenticated ? (
                <PlaylistDetail 
                  isLikedView={true}
                  playlists={playlists}
                  onSelect={(song, list) => { setCurrentTrack(song); setCurrentPlaylist(list); }} 
                  likedIds={likedIds}
                  onToggleLike={toggleLike}
                  onAddToPlaylist={addTrackToPlaylist}
                />
              ) : <Navigate to="/login" />
            } />

            <Route path="/collection/library" element={
              isAuthenticated ? (
                <Library 
                  playlists={playlists} 
                  onCreatePlaylist={handleCreatePlaylist} 
                  likedCount={likedIds.length} 
                  likedPlaylistId={likedPlaylist?.id}
                />
              ) : <Navigate to="/login" />
            } />

            <Route path="/playlist/:id" element={
              isAuthenticated ? (
                <PlaylistDetail 
                  playlists={playlists}
                  onSelect={(song, list) => { setCurrentTrack(song); setCurrentPlaylist(list); }}
                  likedIds={likedIds}
                  onToggleLike={toggleLike}
                  onAddToPlaylist={addTrackToPlaylist}
                />
              ) : <Navigate to="/login" />
            } />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </Box>
         {/* 3. PLAYER BAR: Fixed ONLY to the bottom of the main area */}
        {isAuthenticated && currentTrack && (
  <Box 
    sx={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 240, // Starts after Sidebar
      width: 'calc(100% - 240px)', 
      height: '90px', // Explicit height helps stabilize the layout
      bgcolor: '#181818',
      borderTop: '1px solid #282828',
      zIndex: 1100,
      display: 'flex', // Forces the internal PlayerBar to behave
      alignItems: 'center'
    }}
  >
    <PlayerBar 
      track={currentTrack} 
      playlist={currentPlaylist} 
      onTrackChange={setCurrentTrack} 
    />
  </Box>
)}
        </Box>
      </Box>
    </Router>
  );
}