import React, { useState } from 'react';
import { TextField, IconButton, Box, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} 
      sx={{ 
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        maxWidth: 600,
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <TextField
        fullWidth
        variant="standard"
        placeholder="Search for music..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ 
          ml: 1,
          flex: 1,
          '& .MuiInputBase-input': {
            color: 'inherit',
          },
          '& .MuiInput-underline:before': {
            borderBottomColor: 'rgba(255, 255, 255, 0.3)',
          },
        }}
        InputProps={{
          disableUnderline: true,
        }}
      />
      <IconButton type="submit" sx={{ p: '10px', color: 'inherit' }}>
        <Search />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;