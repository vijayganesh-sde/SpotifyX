import React, { useEffect, useRef, useState } from 'react';
import { Paper, Stack, Box, Typography, IconButton, Slider } from '@mui/material';
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

  // Restored these crucial handlers
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSliderChange = (event, newValue) => {
    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    audioRef.current.volume = newValue;
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSkip = (direction) => {
    if (!playlist || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(s => s.id === track.id);
    let nextIndex;

    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % playlist.length;
    } else {
      nextIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    onTrackChange(playlist[nextIndex]);
  };

  if (!track) return null;

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: '#181818', color: 'white', p: 2, zIndex: 1300 }}>
      {/* ADDED LISTENERS BACK HERE */}
      <audio 
        key={track.id} 
        ref={audioRef} 
        src={audioSrc} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => handleSkip('next')} // Auto-play next song
      />
      
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box sx={{ width: '30%', display: 'flex', alignItems: 'center' }}>
          <img src={imageSrc} alt="" style={{ width: 48, height: 48, borderRadius: 4, objectFit: 'cover' }} />
          <Box sx={{ ml: 1.5, overflow: 'hidden' }}>
            <Typography variant="caption" fontWeight="bold" display="block" noWrap>{track.title}</Typography>
            <Typography variant="caption" color="#b3b3b3" display="block" noWrap>{track.artist}</Typography>
          </Box>
        </Box>

        <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <IconButton onClick={() => handleSkip('prev')} sx={{ color: '#b3b3b3' }}>
              <SkipPreviousIcon />
            </IconButton>
            
            <IconButton onClick={togglePlay} sx={{ color: 'white', transform: 'scale(1.3)' }}>
              {isPlaying ? <PauseCircleFilledIcon fontSize="large" /> : <PlayCircleFilledIcon fontSize="large" />}
            </IconButton>
            
            <IconButton onClick={() => handleSkip('next')} sx={{ color: '#b3b3b3' }}>
              <SkipNextIcon />
            </IconButton>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ color: '#b3b3b3', minWidth: 25 }}>
              {Math.floor(currentTime)}s
            </Typography>
            <Slider 
              size="small" 
              value={currentTime} 
              max={duration || 30} 
              onChange={handleSliderChange} 
              sx={{ color: '#1DB954' }} 
            />
            <Typography variant="caption" sx={{ color: '#b3b3b3', minWidth: 25 }}>
              {Math.floor(duration || 30)}s
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <VolumeUpIcon sx={{ fontSize: 20, mr: 1, color: '#b3b3b3' }} />
          <Slider size="small" value={volume} min={0} max={1} step={0.01} onChange={handleVolumeChange} sx={{ width: 80, color: 'white' }} />
        </Box>
      </Stack>
    </Paper>
  );
}