import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  Button,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Link as MuiLink
} from '@mui/material';
import { Shield, Info, LibraryBooks } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TextAnalysis from '../components/TextAnalysis';
import ImageAnalysis from '../components/ImageAnalysis';
import URLAnalysis from '../components/URLAnalysis';
import { analyzeText, analyzeImage, analyzeUrl } from '../services/api';

function HomePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHero, setShowHero] = useState(true);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
    setShowHero(false);
  };

  const handleAnalyzeText = async (text) => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyzeText(text);
      // Include original text in navigation state
      navigate('/results', { state: { result, originalContent: { type: 'text', text } } });
    } catch (err) {
      setError(err.message || 'Failed to analyze text');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeImage = async (file) => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyzeImage(file);
      // Create image preview URL
      const imageUrl = URL.createObjectURL(file);
      navigate('/results', { state: { result, originalContent: { type: 'image', url: imageUrl, name: file.name } } });
    } catch (err) {
      setError(err.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeUrl = async (url) => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyzeUrl(url);
      // Include original URL in navigation state
      navigate('/results', { state: { result, originalContent: { type: 'url', url } } });
    } catch (err) {
      setError(err.message || 'Failed to analyze URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'transparent' }}>
        <Toolbar>
          <Shield sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ESafety Threat Detection
          </Typography>
          <Button color="inherit" startIcon={<Info />} href="/about">
            About
          </Button>
          <Button color="inherit" startIcon={<LibraryBooks />} href="/resources">
            Resources
          </Button>
          <Button
            color="inherit"
            href="/pricing"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            Pricing
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 6, pb: 8 }}>
        {showHero && (
          <Paper elevation={8} sx={{ p: 5, mb: 6, borderRadius: 4, background: 'rgba(255,255,255,0.95)' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#667eea' }}>
                Protect Children Online
              </Typography>
              <Typography variant="h5" sx={{ color: 'text.secondary', mb: 3, maxWidth: 800, mx: 'auto' }}>
                AI-powered instant safety analysis for parents, educators, and caregivers
              </Typography>
            </Box>

            <Box sx={{ mb: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#764ba2' }}>
                👪 For Parents & Guardians
              </Typography>
              <Typography variant="body1" paragraph>
                Concerned about your child's online interactions? Upload screenshots of suspicious messages,
                social media posts, or chat conversations to instantly detect potential threats like:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Box sx={{ bgcolor: '#ffe0b2', px: 2, py: 1, borderRadius: 1 }}>
                  <Typography variant="body2">🚨 <strong>Online Grooming</strong></Typography>
                </Box>
                <Box sx={{ bgcolor: '#ffccbc', px: 2, py: 1, borderRadius: 1 }}>
                  <Typography variant="body2">😢 <strong>Cyberbullying</strong></Typography>
                </Box>
                <Box sx={{ bgcolor: '#e1bee7', px: 2, py: 1, borderRadius: 1 }}>
                  <Typography variant="body2">⚠️ <strong>Inappropriate Content</strong></Typography>
                </Box>
                <Box sx={{ bgcolor: '#c5cae9', px: 2, py: 1, borderRadius: 1 }}>
                  <Typography variant="body2">🤖 <strong>Deepfakes</strong></Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 4, p: 3, bgcolor: '#e8f5e9', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#2e7d32' }}>
                🏫 For Educators & School Staff
              </Typography>
              <Typography variant="body1" paragraph>
                Identify and respond to bullying incidents quickly. Analyze student-reported content,
                social media interactions, or classroom concerns with our specialized detection for:
              </Typography>
              <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                <li><Typography variant="body2"><strong>Coordinated attacks</strong> - Detect multiple students targeting one victim</Typography></li>
                <li><Typography variant="body2"><strong>Persistent harassment</strong> - Track repeated bullying patterns</Typography></li>
                <li><Typography variant="body2"><strong>Escalating threats</strong> - Identify when situations turn critical</Typography></li>
              </ul>
            </Box>

            <Box sx={{ p: 3, bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
                🔒 Your Privacy is Protected
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>✓ No Account Required</Typography>
                  <Typography variant="caption">Start analyzing immediately</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>✓ No Data Stored</Typography>
                  <Typography variant="caption">Your content is never saved</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>✓ On-Demand Only</Typography>
                  <Typography variant="caption">No monitoring or surveillance</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            {showHero ? 'Get Started' : 'Instant Content Safety Analysis'}
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            {showHero ? 'Choose how you want to analyze content' : 'Upload images, paste links, or share text for immediate safety assessment'}
          </Typography>
        </Box>

        <Paper elevation={24} sx={{ p: 4, borderRadius: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Text" />
            <Tab label="Image" />
            <Tab label="URL/Link" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ ml: 3 }}>
                Analyzing content...
              </Typography>
            </Box>
          )}

          {!loading && (
            <>
              {activeTab === 0 && <TextAnalysis onAnalyze={handleAnalyzeText} />}
              {activeTab === 1 && <ImageAnalysis onAnalyze={handleAnalyzeImage} />}
              {activeTab === 2 && <URLAnalysis onAnalyze={handleAnalyzeUrl} />}
            </>
          )}
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Privacy-first analysis • No surveillance • No account required
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
