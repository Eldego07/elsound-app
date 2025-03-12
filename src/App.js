import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import Player from './components/Player';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Snackbar, Alert, Paper, Box, useTheme, useMediaQuery } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ThemeContext } from './context/ThemeContext';
import { encrypt, decrypt } from './utils/crypto';

function App() {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(100);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Get video ID from URL parameters
    const params = new URLSearchParams(location.search);
    const videoId = params.get('v');
    if (videoId) {
      setCurrentVideo(videoId);
    }
  }, [location]);

  const handleVideoSelect = (videoId) => {
    setCurrentVideo(videoId);
    // Update URL with video ID
    navigate(`?v=${videoId}`);
  };

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const API_KEY = 'AIzaSyCucLgxpUROxLbBc20tKWsboBrj0a_0N7o';
      
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          maxResults: 10,
          key: API_KEY,
          q: searchTerm,
          type: 'video',
          videoCategoryId: '10' // Add music category filter
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': 'https://eldego07.github.io',
          'Referer': 'https://eldego07.github.io/elsound-app/'
        },
        withCredentials: false
      });
      
      if (!response.data || !response.data.items) {
        throw new Error('Invalid response from YouTube API');
      }
      
      console.log('API Response:', response.data); // Debug line
      setVideos(response.data.items);
    } catch (error) {
      console.error('Search error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(`Failed to fetch videos: ${error.response?.data?.error?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVolumeChange = (newValue) => {
    setVolume(newValue);
  };

  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleTitleClick = () => {
    navigate('/');
    setCurrentVideo(null);
    setVideos([]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      <Paper elevation={3} sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2, 
        maxWidth: '800px',  // Add this line
        margin: '0 auto',   // Add this line
        background: darkMode ? 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)' : 'linear-gradient(145deg, #f0f0f0 0%, #ffffff 100%)',
        color: darkMode ? '#fff' : '#000'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '100%'  // Add this line
        }}>
          <Typography 
            variant="h3" 
            className="app-title"
            onClick={handleTitleClick}
            sx={{ 
              margin: '20px 0',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            ElSound
          </Typography>
          <IconButton 
            onClick={() => setDarkMode(!darkMode)} 
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
        <SearchBar onSearch={handleSearch} />
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
        <Box sx={{ flex: 2 }}>
          <Player 
            videoId={currentVideo} 
            volume={volume}
            onVolumeChange={setVolume}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          {loading && (
            <Box display="flex" justifyContent="center" m={2}>
              <CircularProgress sx={{ color: darkMode ? '#fff' : '#1976d2' }} />
            </Box>
          )}

          {!loading && videos.length > 0 && (
            <Paper elevation={2} sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff',
              color: darkMode ? '#fff' : '#000'
            }}>
              <List sx={{ maxHeight: '600px', overflow: 'auto' }}>
                {videos.map((video) => (
                  <ListItem 
                    button 
                    key={video.id.videoId}
                    onClick={() => handleVideoSelect(video.id.videoId)}
                    sx={{
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      },
                      borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                    }}
                  >
                    <ListItemText 
                      primary={video.snippet.title}
                      secondary={video.snippet.channelTitle}
                      primaryTypographyProps={{
                        sx: { 
                          fontWeight: 'medium',
                          color: darkMode ? '#fff' : '#000'
                        }
                      }}
                      secondaryTypographyProps={{
                        sx: { 
                          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          padding: '8px 12px',
          borderRadius: '4px',
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          color: darkMode ? '#ffffff' : '#000000',
          fontStyle: 'italic',
          fontWeight: 'medium',
          zIndex: 9999,
          backdropFilter: 'blur(5px)',
          textShadow: darkMode ? '1px 1px 2px rgba(0,0,0,0.5)' : '1px 1px 2px rgba(255,255,255,0.5)',
          border: '1px solid',
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 1)',
            transform: 'translateY(-2px)',
          }
        }}
      >
        di produzione Casolaro Diego
      </Typography>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ 
          width: '100%',
          color: '#fff',
          backgroundColor: 'rgba(211, 47, 47, 0.9)'
        }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;