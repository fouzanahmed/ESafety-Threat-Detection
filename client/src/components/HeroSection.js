import React from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const HeroSection = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        mb: 4,
        borderRadius: '0 0 50px 50px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
                mb: 3
              }}
            >
              ESafety Threat Detection
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                fontWeight: 300,
                opacity: 0.95,
                fontSize: { xs: '1.1rem', md: '1.4rem' }
              }}
            >
              Protect your loved ones with AI-powered instant safety analysis
            </Typography>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                🎯 Who is this for?
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PeopleIcon sx={{ mr: 1.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Parents
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                        Monitor children's online safety
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon sx={{ mr: 1.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Educators
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                        Protect students from bullying
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VerifiedUserIcon sx={{ mr: 1.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Law Enforcement
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                        Identify predatory behavior
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ShieldIcon sx={{ mr: 1.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Platforms
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                        Content moderation at scale
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              elevation={6}
              sx={{
                bgcolor: 'white',
                color: 'text.primary',
                borderRadius: 4,
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#667eea', fontWeight: 700 }}>
                  ⚡ Instant Analysis
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                  Upload screenshots, paste links, or share text to receive immediate threat assessments with actionable insights.
                </Typography>

                <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#667eea', mb: 1 }}>
                    ✅ What we detect:
                  </Typography>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li><Typography variant="body2">Online Grooming (50+ patterns)</Typography></li>
                    <li><Typography variant="body2">Cyberbullying (40+ patterns)</Typography></li>
                    <li><Typography variant="body2">Deepfakes & Manipulated Media</Typography></li>
                    <li><Typography variant="body2">Extremist Content</Typography></li>
                    <li><Typography variant="body2">Coordinated Attacks</Typography></li>
                  </ul>
                </Box>

                <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2e7d32', mb: 1 }}>
                    🔒 Privacy-First Design
                  </Typography>
                  <Typography variant="body2">
                    • No account required<br />
                    • On-demand analysis only<br />
                    • No monitoring or surveillance<br />
                    • Your data is never stored
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
