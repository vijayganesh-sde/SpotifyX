import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';

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
import API from './api/axiosConfig';

export default function App() {
  // 1. Auth State (Replace with your actual logic/localStorage check)
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  // 2. Music State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // 1. Fetch playlists on Load
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await API.get('/playlists');
        setPlaylists(response.data);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    };
    fetchPlaylists();
  }, []);

  // 2. Save new playlist to DB
  const handleCreatePlaylist = async (name) => {
    const res = await API.post('/playlists', { name });
    setPlaylists([...playlists, res.data]);
  };

  // 3. Add track to playlist in DB
  const addTrackToPlaylist = async (playlistId, trackId) => {
    await API.post(`/playlists/${playlistId}/add/${trackId}`);
    // Refresh playlists to show updated counts
    const res = await API.get('/playlists');
    setPlaylists(res.data);
  };

  const toggleLike = (song) => {
    setLikedSongs(prev => prev.find(s => s.id === song.id) 
      ? prev.filter(s => s.id !== song.id) 
      : [...prev, song]
    );
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', bgcolor: '#000', minHeight: '100vh', color: 'white' }}>
        
        {/* Only show Sidebar if logged in */}
        {isAuthenticated && <Sidebar likedCount={likedSongs.length} onLogout={() => setIsAuthenticated(false)} />}
        
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/landing" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/" />} />
            <Route path="/login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
            <Route path="/register" element={<Register />} />

            {/* --- PRIVATE ROUTES --- */}
            <Route path="/" element={
              isAuthenticated ? (
                <Home
                  playlists={playlists}
                  onAddToPlaylist={addTrackToPlaylist} 
                  onSelect={(song, list) => { setCurrentTrack(song); setPlaylist(list); }} 
                  likedIds={likedSongs.map(s => s.id)}
                  onToggleLike={toggleLike}
                />
              ) : <Navigate to="/landing" />
            } />

            <Route path="/collection/tracks" element={
              isAuthenticated ? (
                <Home 
                  isLikedView={true} 
                  likedSongs={likedSongs}
                  onSelect={(song, list) => { setCurrentTrack(song); setPlaylist(list); }} 
                  likedIds={likedSongs.map(s => s.id)}
                  onToggleLike={toggleLike}
                />
              ) : <Navigate to="/login" />
            } />

            <Route path="/collection/library" element={
              <Library 
                playlists={playlists} 
                onCreatePlaylist={handleCreatePlaylist} 
                likedCount={likedSongs.length} 
              />
            } />

            <Route path="/playlist/:id" element={
              <PlaylistDetail 
                playlists={playlists}
                onSelect={(song, list) => { setCurrentTrack(song); setPlaylist(list); }}
                likedIds={likedSongs.map(s => s.id)}
                onToggleLike={toggleLike}
                onAddToPlaylist={addTrackToPlaylist}
              />
            } />
          </Routes>
        </Box>

        {/* Only show Player if logged in and a track is selected */}
        {isAuthenticated && currentTrack && (
          <PlayerBar 
            track={currentTrack} 
            playlist={playlist} 
            onTrackChange={setCurrentTrack} 
          />
        )}
      </Box>
    </Router>
  );
}