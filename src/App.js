import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import Player from './components/Player';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(100);
  const location = useLocation();
  const navigate = useNavigate();

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
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          maxResults: 10,
          key: 'AIzaSyCtHhC_d9bS1p42QPjy2ieKXnrxjaJemrI',
          q: searchTerm,
          type: 'video'
        }
      });
      setVideos(response.data.items);
    } catch (error) {
      setError('Failed to fetch videos. Please try again.');
      console.error('Error searching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVolumeChange = (newValue) => {
    setVolume(newValue);
  };

  return (
    <Container>
      <Typography variant="h3" sx={{ margin: '20px 0' }}>
        ElSound
      </Typography>
      <SearchBar onSearch={handleSearch} />
      <Player 
        videoId={currentVideo} 
        volume={volume}
        onVolumeChange={setVolume}
      />
      
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
          <CircularProgress />
        </div>
      )}

      {!loading && videos.length > 0 && (
        <List>
          {videos.map((video) => (
            <ListItem 
              button 
              key={video.id.videoId}
              onClick={() => handleVideoSelect(video.id.videoId)}
            >
              <ListItemText 
                primary={video.snippet.title}
                secondary={video.snippet.channelTitle}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;