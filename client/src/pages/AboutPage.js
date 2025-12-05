import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { ArrowBack, Shield, Star, Security, Speed, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function AboutPage() {
  const navigate = useNavigate();

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
          Back to Home
        </Button>

        <Paper elevation={24} sx={{ p: 6, borderRadius: 4 }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            About ESafety Threat Detection
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            AI-powered content safety analysis for everyone
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
            ESafety Threat Detection is a cutting-edge platform that uses artificial intelligence to analyze
            online content for potential safety threats. Our mission is to make the internet safer by providing
            instant, accessible threat analysis for anyone who needs it.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 5, mb: 3 }}>
            Key Features
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Speed color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Instant Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get results in seconds with our advanced AI models
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Security color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Privacy-First
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No surveillance, no tracking - just on-demand analysis
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Star color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Multi-Format Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Analyze text, images, videos, and social media links
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <People color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No Account Required
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instant access for everyone, anytime
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mt: 5, mb: 3 }}>
            How It Works
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            <strong>1. Upload or Paste Content:</strong> Share any content you want analyzed - screenshots,
            text conversations, social media links, or video URLs.
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            <strong>2. AI Analysis:</strong> Our advanced AI models analyze the content using natural language
            processing and computer vision to detect patterns associated with various threat categories.
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            <strong>3. Get Results:</strong> Receive a threat score (0-100), category classification, detailed
            explanation, and actionable recommendations.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 5, mb: 3 }}>
            Threat Categories
          </Typography>

          <Typography variant="body1" component="div" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            We detect and analyze content across multiple threat categories:
            <ul style={{ marginTop: 16 }}>
              <li><strong>Incel Ideology:</strong> Misogynistic content, entitlement narratives</li>
              <li><strong>MGTOW:</strong> Anti-women rhetoric and harmful gender ideology</li>
              <li><strong>Pick-Up Artist:</strong> Manipulative dating tactics and objectification</li>
              <li><strong>Grooming:</strong> Predatory behavior toward minors</li>
              <li><strong>Extremist Content:</strong> Violent extremism and hate speech</li>
              <li><strong>General Concerns:</strong> Other potentially harmful content</li>
            </ul>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 5, mb: 3 }}>
            Built for the Grand Challenge
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            This platform was developed to address critical online safety needs while demonstrating innovation,
            technical excellence, and real-world viability. Our solution combines cutting-edge AI with practical
            usability to create a tool that can truly make a difference.
          </Typography>

          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{ px: 4, py: 1.5 }}
            >
              Try It Now
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AboutPage;
