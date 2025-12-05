import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  ArrowBack,
  Warning,
  CheckCircle,
  Info,
  Recommend,
  Shield
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const originalContent = location.state?.originalContent;

  if (!result) {
    return (
      <Container maxWidth="md" sx={{ pt: 8 }}>
        <Alert severity="error">
          No analysis results found. Please go back and analyze content first.
        </Alert>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  const getThreatColor = (score) => {
    if (score < 30) return 'success';
    if (score < 60) return 'warning';
    return 'error';
  };

  const getThreatLabel = (score) => {
    if (score < 30) return 'Low Risk';
    if (score < 60) return 'Moderate Risk';
    if (score < 80) return 'High Risk';
    return 'Critical Risk';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      safe: 'Safe Content',
      concerning: 'Concerning Content',
      incel: 'Incel Ideology',
      mgtow: 'MGTOW Content',
      pua: 'Pick-up Artist Content',
      grooming: 'Potential Grooming',
      extremist: 'Extremist Content'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      safe: 'success',
      concerning: 'warning',
      incel: 'error',
      mgtow: 'error',
      pua: 'warning',
      grooming: 'error',
      extremist: 'error'
    };
    return colors[category] || 'default';
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'transparent' }}>
        <Toolbar>
          <Shield sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ESafety Threat Detection
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3, color: 'white' }}
        >
          New Analysis
        </Button>

        <Grid container spacing={3}>
          {/* Original Content Display */}
          {originalContent && (
            <Grid item xs={12}>
              <Paper elevation={12} sx={{ p: 4, borderRadius: 4, bgcolor: '#f9fafb', border: '2px dashed #667eea' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#667eea', mb: 3 }}>
                  📋 Analyzed Content
                </Typography>

                {originalContent.type === 'text' && (
                  <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                      {originalContent.text}
                    </Typography>
                  </Box>
                )}

                {originalContent.type === 'image' && (
                  <Box sx={{ textAlign: 'center' }}>
                    <img
                      src={originalContent.url}
                      alt={originalContent.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                      {originalContent.name}
                    </Typography>
                  </Box>
                )}

                {originalContent.type === 'url' && (
                  <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Analyzed URL:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        wordBreak: 'break-all',
                        color: '#1976d2',
                        fontFamily: 'monospace'
                      }}
                    >
                      {originalContent.url}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          )}

          {/* Main Results Card */}
          <Grid item xs={12} md={8}>
            <Paper elevation={24} sx={{ p: 4, borderRadius: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  🔍 Analysis Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(result.timestamp).toLocaleString()}
                </Typography>
              </Box>

              {/* Threat Score */}
              <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Threat Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h2" fontWeight="bold" sx={{ mr: 2 }}>
                      {result.threatScore}
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                      / 100
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={result.threatScore}
                    color={getThreatColor(result.threatScore)}
                    sx={{ height: 10, borderRadius: 5, mb: 2 }}
                  />
                  <Chip
                    label={getThreatLabel(result.threatScore)}
                    color={getThreatColor(result.threatScore)}
                    size="large"
                  />
                </CardContent>
              </Card>

              {/* Category */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Content Category
                  </Typography>
                  <Chip
                    label={getCategoryLabel(result.category)}
                    color={getCategoryColor(result.category)}
                    size="large"
                    sx={{ fontSize: '1.1rem', py: 2.5, px: 1 }}
                  />
                </CardContent>
              </Card>

              {/* Explanation */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Info sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Analysis Explanation
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {result.explanation}
                  </Typography>
                  {result.confidence && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Confidence: {Math.round(result.confidence * 100)}%
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Detected Patterns */}
              {result.detectedPatterns && result.detectedPatterns.length > 0 && (
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Warning sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Detected Patterns
                      </Typography>
                    </Box>
                    <List>
                      {result.detectedPatterns.map((pattern, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary={pattern.pattern}
                            secondary={`Category: ${pattern.category} | Count: ${pattern.count}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
            </Paper>
          </Grid>

          {/* Recommendations Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={24} sx={{ p: 3, borderRadius: 4, position: 'sticky', top: 20 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Recommend sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Recommendations
                </Typography>
              </Box>

              {result.recommendations && result.recommendations.length > 0 ? (
                <List>
                  {result.recommendations.map((rec, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircle color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={rec}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No specific recommendations at this time.
                </Typography>
              )}

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => navigate('/resources', { state: { category: result.category } })}
              >
                View Resources
              </Button>

              {result.threatScore >= 70 && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  This content shows signs of serious concern. Consider reporting to authorities or platform moderators.
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ResultsPage;
