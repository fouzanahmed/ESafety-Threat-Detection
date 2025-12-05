import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { CloudUpload, Image as ImageIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

function ImageAnalysis({ onAnalyze }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 10485760 // 10MB
  });

  const handleSubmit = () => {
    if (file) {
      onAnalyze(file);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Image
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload a screenshot, meme, or any image you want analyzed
      </Typography>

      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          mb: 3,
          transition: 'all 0.3s'
        }}
      >
        <input {...getInputProps()} />
        {preview ? (
          <Box>
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Click or drag to change image
            </Typography>
          </Box>
        ) : (
          <Box>
            <CloudUpload sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to select a file
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Supports: JPEG, PNG, GIF, WebP (max 10MB)
            </Typography>
          </Box>
        )}
      </Paper>

      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<ImageIcon />}
        onClick={handleSubmit}
        disabled={!file}
      >
        Analyze Image
      </Button>
    </Box>
  );
}

export default ImageAnalysis;
