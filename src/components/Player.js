import React, { useContext } from 'react';
import YouTube from 'react-youtube';
import { Box, Slider, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import { ThemeContext } from '../context/ThemeContext';

function Player({ videoId, volume, onVolumeChange }) {
  const { darkMode } = useContext(ThemeContext);
  
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      controls: 1,
      disablekb: 0,
      playsinline: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      fs: 1,
      enablejsapi: 1,
      origin: window.location.origin,
    },
  };

  const onReady = (event) => {
    // Set initial volume
    event.target.setVolume(volume);
    // Enable background playback
    event.target.setPlaybackQuality('small');
    // Add audio-only optimization
    event.target.setOption('player', 'audioonly', true);
  };

  const onStateChange = (event) => {
    // Skip ads if they appear
    if (event.data === -1 || event.data === 3) {
      event.target.playVideo();
    }
  };

  const handleVolumeChange = (event, newValue) => {
    onVolumeChange(newValue);
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeMuteIcon />;
    if (volume < 50) return <VolumeDownIcon />;
    return <VolumeUpIcon />;
  };

  return (
    <div className="youtube-player" style={{
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.2)',
      }
    }}>
      {videoId && (
        <>
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onReady}
            onStateChange={onStateChange}
            onPlaybackQualityChange={(event) => {
              event.target.setPlaybackQuality('small');
            }}
          />
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            padding: '12px 20px',
            background: darkMode 
              ? 'linear-gradient(to right, rgba(30,30,30,0.95), rgba(20,20,20,0.95))'
              : 'linear-gradient(to right, rgba(255,255,255,0.95), rgba(245,245,245,0.95))',
            borderRadius: '0 0 12px 12px',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid',
            borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }}>
            <IconButton 
              size="small" 
              sx={{ 
                color: darkMode ? '#fff' : '#000',
                opacity: 0.8,
                transition: 'all 0.2s ease',
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.1)'
                }
              }}
            >
              <VolumeIcon />
            </IconButton>
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              aria-labelledby="volume-slider"
              min={0}
              max={100}
              sx={{ 
                width: 120,
                color: darkMode ? '#fff' : '#1976d2',
                '& .MuiSlider-thumb': {
                  width: 14,
                  height: 14,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: `0 0 0 8px ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(25,118,210,0.1)'}`,
                  },
                  '&.Mui-active': {
                    width: 16,
                    height: 16,
                  }
                },
                '& .MuiSlider-track': {
                  height: 4,
                  background: darkMode 
                    ? 'linear-gradient(90deg, #fff, rgba(255,255,255,0.8))'
                    : 'linear-gradient(90deg, #1976d2, rgba(25,118,210,0.8))'
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  opacity: 0.2
                }
              }}
            />
          </Box>
        </>
      )}
    </div>
  );
}

export default Player;