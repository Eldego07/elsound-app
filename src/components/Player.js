import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { Slider, Typography, Box, Button, useTheme, useMediaQuery } from '@mui/material';
import { VolumeUp, YouTube as YouTubeIcon } from '@mui/icons-material';

function Player({ videoId, volume, onVolumeChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [videoError, setVideoError] = useState(false);

  const opts = {
    height: isMobile ? '240' : '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
      origin: window.location.origin,
      enablejsapi: 1,
      modestbranding: 1,
      rel: 0,
      host: 'https://www.youtube.com',
      playsinline: 1,
      controls: 1,
      fs: 1,
      iv_load_policy: 3,
      disablekb: 1
    },
  };

  let player = null;

  const onReady = (event) => {
    player = event.target;
    player.setVolume(volume);
    player.setPlaybackQuality('small');
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        player.playVideo();
      }
    });
  };

  const onError = (error) => {
    console.error("YouTube Player Error:", error);
    setVideoError(true);
  };

  const handleVolumeChange = (event, newValue) => {
    onVolumeChange(newValue);
    if (player) {
      player.setVolume(newValue);
    }
  };

  const openInYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div style={{ margin: '20px', width: '100%', maxWidth: '100vw' }}>
      <div style={{ position: 'relative', paddingTop: isMobile ? '56.25%' : '0' }}>
        {videoId && !videoError ? (
          <div style={{ 
            position: isMobile ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            width: '100%',
            height: isMobile ? '100%' : 'auto' 
          }}>
            <YouTube 
              videoId={videoId} 
              opts={opts} 
              onReady={onReady}
              onError={onError}
              className="youtube-player"
            />
          </div>
        ) : videoError && videoId ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            p={3}
            sx={{ 
              bgcolor: 'background.paper',
              borderRadius: 1,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>
              This video has age restrictions or can only be played on YouTube
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<YouTubeIcon />}
              onClick={openInYouTube}
              sx={{ mt: 2 }}
            >
              Watch on YouTube
            </Button>
          </Box>
        ) : null}
      </div>
      <Box 
        display="flex" 
        alignItems="center" 
        mt={2}
        flexDirection={isMobile ? 'column' : 'row'}
      >
        <VolumeUp />
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          aria-labelledby="volume-slider"
          min={0}
          max={100}
          sx={{ 
            margin: isMobile ? '10px 0' : '0 20px',
            width: isMobile ? '100%' : '200px'
          }}
        />
        <Typography variant="body2">
          {volume}%
        </Typography>
      </Box>
    </div>
  );
}

export default Player;