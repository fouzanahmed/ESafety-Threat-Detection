import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Send } from '@mui/icons-material';

function TextAnalysis({ onAnalyze }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Paste Text Content
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Paste a chat conversation, social media post, or any text you want analyzed
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={10}
        placeholder="Paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="outlined"
        sx={{ mb: 3 }}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        startIcon={<Send />}
        disabled={!text.trim()}
      >
        Analyze Text
      </Button>
    </Box>
  );
}

export default TextAnalysis;
