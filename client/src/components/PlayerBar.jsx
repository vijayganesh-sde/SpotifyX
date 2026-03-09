import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Slider, Stack } from '@mui/material'; // Switched Paper to Box for better layout control
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function PlayerBar({ track, playlist, onTrackChange }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const audioSrc = track?.preview_url || track?.previewUrl;
  const imageSrc = track?.image_url || track?.imageUrl;

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [audioSrc]);

  const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
  const handleLoadedMetadata = () => setDuration(audioRef.current.duration);
  const handleSliderChange = (e, val) => { audioRef.current.currentTime = val; setCurrentTime(val); };
  const handleVolumeChange = (e, val) => { setVolume(val); audioRef.current.volume = val; };

  const togglePlay = () => {
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  const handleSkip = (direction) => {
    if (!playlist || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(s => s.id === track.id);
    const nextIndex = direction === 'next' 
      ? (currentIndex + 1) % playlist.length 
      : (currentIndex - 1 + playlist.length) % playlist.length;
    onTrackChange(playlist[nextIndex]);
  };

  if (!track) return null;

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 240, // 👈 Starts after Sidebar
      right: 0, 
      bgcolor: '#181818', 
      borderTop: '1px solid #282828',
      color: 'white', 
      p: '15px 25px', 
      zIndex: 1100, // Lower than Sidebar
      display: 'flex',
      alignItems: 'center',
      height: 90
    }}>
      <audio 
        key={track.id} 
        ref={audioRef} 
        src={audioSrc} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => handleSkip('next')}
      />
      
      {/* 1. LEFT: Song Info (flex: 1 ensures it doesn't squash) */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, justifyContent: 'space-evenly' }}>
        <img src={imageSrc} alt="" style={{ width: 56, height: 56, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="body2" fontWeight="bold" noWrap sx={{ display: 'block' }}>
            {track.title}
          </Typography>
          <Typography variant="caption" color="#b3b3b3" noWrap sx={{ display: 'block' }}>
            {track.artist}
          </Typography>
        </Box>
      </Box>

      {/* 2. CENTER: Controls (flex: 2 for priority space) */}
      <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 600 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <IconButton onClick={() => handleSkip('prev')} sx={{ color: '#b3b3b3' }}><SkipPreviousIcon /></IconButton>
          <IconButton onClick={togglePlay} sx={{ color: 'white', transform: 'scale(1.2)' }}>
            {isPlaying ? <PauseCircleFilledIcon fontSize="large" /> : <PlayCircleFilledIcon fontSize="large" />}
          </IconButton>
          <IconButton onClick={() => handleSkip('next')} sx={{ color: '#b3b3b3' }}><SkipNextIcon /></IconButton>
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#b3b3b3', width: 35, textAlign: 'right' }}>{Math.floor(currentTime)}s</Typography>
          <Slider size="small" value={currentTime} max={duration || 30} onChange={handleSliderChange} sx={{ color: '#1DB954', '& .MuiSlider-thumb': { display: 'none' }, '&:hover .MuiSlider-thumb': { display: 'block' } }} />
          <Typography variant="caption" sx={{ color: '#b3b3b3', width: 35 }}>{Math.floor(duration || 30)}s</Typography>
        </Stack>
      </Box>

      {/* 3. RIGHT: Volume */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <VolumeUpIcon sx={{ fontSize: 20, mr: 1, color: '#b3b3b3' }} />
        <Slider size="small" value={volume} min={0} max={1} step={0.01} onChange={handleVolumeChange} sx={{ width: 100, color: 'white' }} />
      </Box>
    </Box>
  );
}