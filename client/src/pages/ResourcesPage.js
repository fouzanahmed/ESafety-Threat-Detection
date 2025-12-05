import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink
} from '@mui/material';
import { ArrowBack, Shield, Phone, Public, Warning } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getResources } from '../services/api';

function ResourcesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);
  const category = location.state?.category || 'general';

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources(category);
        setResources(data.resources);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [category]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

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
          {resources && (
            <>
              <Box sx={{ mb: 4 }}>
                <Chip label={category} color="primary" sx={{ mb: 2 }} />
                <Typography variant="h3" gutterBottom fontWeight="bold">
                  {resources.title}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {resources.description}
                </Typography>
              </Box>

              {category === 'grooming' && (
                <Alert severity="error" icon={<Warning />} sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    URGENT: Child Safety Issue
                  </Typography>
                  If you suspect a child is in danger, contact local law enforcement or the National Center
                  for Missing & Exploited Children immediately.
                </Alert>
              )}

              {resources.emergencyContact && (
                <Card sx={{ mb: 4, background: '#ffebee' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom color="error">
                      Emergency Contact
                    </Typography>
                    <Typography variant="h6">{resources.emergencyContact.name}</Typography>
                    <Typography variant="body1">
                      Phone: <strong>{resources.emergencyContact.phone}</strong>
                    </Typography>
                    {resources.emergencyContact.online && (
                      <Typography variant="body1">
                        Online: <MuiLink href={`https://${resources.emergencyContact.online}`} target="_blank">
                          {resources.emergencyContact.online}
                        </MuiLink>
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {resources.emergencyContact.available}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {resources.helplines && resources.helplines.length > 0 && (
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Phone sx={{ mr: 1 }} />
                      <Typography variant="h5">
                        Helplines
                      </Typography>
                    </Box>
                    <List>
                      {resources.helplines.map((helpline, index) => (
                        <ListItem key={index} sx={{ display: 'block', mb: 2 }}>
                          <Typography variant="h6">{helpline.name}</Typography>
                          <Typography variant="body1">
                            {helpline.phone && <><strong>Phone:</strong> {helpline.phone}</>}
                            {helpline.text && <><strong>Text:</strong> {helpline.text}</>}
                          </Typography>
                          {helpline.available && (
                            <Typography variant="body2" color="text.secondary">
                              Available: {helpline.available}
                            </Typography>
                          )}
                          {helpline.description && (
                            <Typography variant="body2" color="text.secondary">
                              {helpline.description}
                            </Typography>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              {resources.resources && resources.resources.length > 0 && (
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Public sx={{ mr: 1 }} />
                      <Typography variant="h5">
                        Online Resources
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {resources.resources.map((resource, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                {resource.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {resource.description}
                              </Typography>
                              <Button
                                variant="outlined"
                                href={resource.url}
                                target="_blank"
                                size="small"
                              >
                                Visit Website
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {resources.actions && resources.actions.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Recommended Actions
                    </Typography>
                    <List>
                      {resources.actions.map((action, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={action}
                            primaryTypographyProps={{ variant: 'body1' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default ResourcesPage;
