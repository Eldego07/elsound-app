import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', margin: '20px' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for music..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <IconButton type="submit">
        <Search />
      </IconButton>
    </form>
  );
};

export default SearchBar;