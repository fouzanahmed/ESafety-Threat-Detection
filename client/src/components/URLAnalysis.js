import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Chip, Stack } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';

function URLAnalysis({ onAnalyze }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  const exampleUrls = [
    'YouTube video',
    'TikTok',
    'Reddit post',
    'Instagram post',
    'Twitter/X post'
  ];

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Analyze URL or Link
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Paste a link to a video, social media post, article, or any web content
      </Typography>

      <TextField
        fullWidth
        placeholder="https://example.com/content"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
        type="url"
      />

      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
        Supported platforms:
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        {exampleUrls.map((platform) => (
          <Chip key={platform} label={platform} size="small" variant="outlined" />
        ))}
      </Stack>

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        startIcon={<LinkIcon />}
        disabled={!url.trim()}
      >
        Analyze URL
      </Button>
    </Box>
  );
}

export default URLAnalysis;
