import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  CheckCircle,
  Shield,
  Star,
  Business,
  School,
  People,
  Speed,
  Security,
  Support,
  Analytics,
  VerifiedUser,
  Group
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function PricingPage() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [customerType, setCustomerType] = useState('individual');

  const handleBillingChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setBillingPeriod(newPeriod);
    }
  };

  const handleCustomerTypeChange = (event, newType) => {
    if (newType !== null) {
      setCustomerType(newType);
    }
  };

  // Individual/Family Plans
  const individualPlans = [
    {
      name: 'Free',
      subtitle: 'For trying out',
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        '5 analyses per month',
        'Text analysis',
        'Basic image analysis',
        'Threat score (0-100)',
        'Community support',
        'Basic threat detection'
      ],
      limitations: [
        'No video analysis',
        'No multi-image batch',
        'No priority support'
      ],
      cta: 'Get Started Free',
      color: '#757575'
    },
    {
      name: 'Family',
      subtitle: 'Most popular for parents',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      popular: true,
      features: [
        '100 analyses per month',
        'All content types (text, image, video)',
        'Instagram Reel frame extraction',
        'YouTube transcript analysis',
        'Multi-image batch (up to 10)',
        'Grooming detection (50+ patterns)',
        'Cyberbullying detection (40+ patterns)',
        'Deepfake detection',
        'Email support',
        'Analysis history (30 days)',
        'Downloadable reports'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      color: '#667eea',
      badge: 'MOST POPULAR'
    },
    {
      name: 'Premium',
      subtitle: 'For power users',
      monthlyPrice: 24.99,
      annualPrice: 249.99,
      popular: false,
      features: [
        'Unlimited analyses',
        'Everything in Family, plus:',
        'Priority processing',
        'Advanced conversation threading',
        'Coordinated attack detection',
        'API access (1,000 calls/month)',
        '24/7 priority support',
        'Analysis history (1 year)',
        'Custom threat categories',
        'White-label reports',
        'Dedicated account manager'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      color: '#764ba2',
      badge: 'BEST VALUE'
    }
  ];

  // School/Enterprise Plans
  const schoolPlans = [
    {
      name: 'School Basic',
      subtitle: 'For small schools',
      monthlyPrice: 199,
      annualPrice: 1999,
      popular: false,
      features: [
        'Up to 500 students',
        '5 staff accounts',
        '1,000 analyses per month',
        'All detection features',
        'Bulk upload (CSV)',
        'Admin dashboard',
        'Student incident tracking',
        'Email support',
        'Training webinar (1 session)',
        'Monthly reports'
      ],
      userInfo: '~500 students',
      cta: 'Request Demo',
      color: '#2e7d32'
    },
    {
      name: 'School Pro',
      subtitle: 'For medium schools',
      monthlyPrice: 499,
      annualPrice: 4999,
      popular: true,
      features: [
        'Up to 2,000 students',
        '20 staff accounts',
        '5,000 analyses per month',
        'Everything in Basic, plus:',
        'Advanced analytics dashboard',
        'Automated alerts',
        'Integration with SIS',
        'API access (5,000 calls/month)',
        'Priority support',
        'Training webinars (quarterly)',
        'Custom workflows',
        'Compliance reporting'
      ],
      userInfo: '~2,000 students',
      cta: 'Request Demo',
      color: '#667eea',
      badge: 'RECOMMENDED'
    },
    {
      name: 'District',
      subtitle: 'For school districts',
      monthlyPrice: null,
      annualPrice: null,
      popular: false,
      features: [
        'Unlimited students',
        'Unlimited staff accounts',
        'Unlimited analyses',
        'Everything in Pro, plus:',
        'Multi-school management',
        'District-wide analytics',
        'SSO integration (SAML, OAuth)',
        'Dedicated infrastructure',
        'Custom integrations',
        'On-premise deployment option',
        '24/7 phone support',
        'Dedicated account team',
        'SLA guarantee (99.9% uptime)',
        'Annual on-site training'
      ],
      userInfo: 'Enterprise scale',
      cta: 'Contact Sales',
      color: '#764ba2',
      badge: 'ENTERPRISE'
    }
  ];

  const currentPlans = customerType === 'individual' ? individualPlans : schoolPlans;

  const getPrice = (plan) => {
    if (plan.monthlyPrice === null) return 'Custom';
    const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    return price === 0 ? 'Free' : `$${price}`;
  };

  const getSavings = (plan) => {
    if (billingPeriod === 'monthly' || plan.monthlyPrice === null || plan.monthlyPrice === 0) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.annualPrice;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return `Save ${percentage}% ($${savings.toFixed(2)})`;
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <AppBar position="static" elevation={0} sx={{ background: 'transparent' }}>
        <Toolbar>
          <Shield sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ESafety Threat Detection
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: 2
            }}
          >
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.95)', mb: 4 }}>
            Protect your loved ones with AI-powered safety analysis
          </Typography>

          {/* Customer Type Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup
              value={customerType}
              exclusive
              onChange={handleCustomerTypeChange}
              sx={{
                bgcolor: 'white',
                borderRadius: 3,
                '& .MuiToggleButton-root': {
                  px: 4,
                  py: 1.5,
                  border: 'none',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: '#667eea',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#5568d3'
                    }
                  }
                }
              }}
            >
              <ToggleButton value="individual">
                <People sx={{ mr: 1 }} />
                Individual & Family
              </ToggleButton>
              <ToggleButton value="school">
                <School sx={{ mr: 1 }} />
                Schools & Districts
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Billing Period Toggle (only for individuals) */}
          {customerType === 'individual' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Typography sx={{ color: 'white', fontWeight: billingPeriod === 'monthly' ? 700 : 400 }}>
                Monthly
              </Typography>
              <ToggleButtonGroup
                value={billingPeriod}
                exclusive
                onChange={handleBillingChange}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 3,
                  '& .MuiToggleButton-root': {
                    px: 3,
                    py: 1,
                    border: 'none',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      bgcolor: '#667eea',
                      color: 'white'
                    }
                  }
                }}
              >
                <ToggleButton value="monthly">Monthly</ToggleButton>
                <ToggleButton value="annual">Annual</ToggleButton>
              </ToggleButtonGroup>
              <Typography sx={{ color: 'white', fontWeight: billingPeriod === 'annual' ? 700 : 400 }}>
                Annual
              </Typography>
              {billingPeriod === 'annual' && (
                <Chip
                  label="Save up to 17%"
                  sx={{
                    bgcolor: '#4caf50',
                    color: 'white',
                    fontWeight: 700
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {currentPlans.map((plan, index) => (
            <Grid item xs={12} md={currentPlans.length === 3 ? 4 : 6} key={index}>
              <Card
                elevation={plan.popular ? 16 : 4}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s',
                  border: plan.popular ? '3px solid #667eea' : 'none',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 24
                  }
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      right: 20,
                      bgcolor: plan.color,
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}
                  >
                    {plan.badge}
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  {/* Plan Name */}
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: plan.color
                    }}
                  >
                    {plan.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                    {plan.subtitle}
                  </Typography>

                  {/* Price */}
                  <Box sx={{ mb: 3 }}>
                    {plan.monthlyPrice === null ? (
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        Custom
                      </Typography>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                          <Typography variant="h3" sx={{ fontWeight: 700 }}>
                            {getPrice(plan)}
                          </Typography>
                          {plan.monthlyPrice > 0 && (
                            <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                              /{billingPeriod === 'monthly' ? 'month' : 'year'}
                            </Typography>
                          )}
                        </Box>
                        {getSavings(plan) && (
                          <Chip
                            label={getSavings(plan)}
                            size="small"
                            sx={{
                              mt: 1,
                              bgcolor: '#e8f5e9',
                              color: '#2e7d32',
                              fontWeight: 600
                            }}
                          />
                        )}
                      </>
                    )}
                    {plan.userInfo && (
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        {plan.userInfo}
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Features */}
                  <List dense sx={{ mb: 2 }}>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle sx={{ color: plan.color, fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: feature.includes('Everything') ? 600 : 400
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>

                {/* CTA Button */}
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    fullWidth
                    variant={plan.popular ? 'contained' : 'outlined'}
                    size="large"
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 700,
                      bgcolor: plan.popular ? plan.color : 'transparent',
                      borderColor: plan.color,
                      color: plan.popular ? 'white' : plan.color,
                      '&:hover': {
                        bgcolor: plan.popular ? plan.color : 'rgba(102, 126, 234, 0.1)',
                        borderColor: plan.color,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Features Comparison */}
        <Paper elevation={8} sx={{ p: 5, borderRadius: 4, bgcolor: 'white' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
            Why Choose ESafety Threat Detection?
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Speed sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Instant Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get threat scores and explanations in seconds. No waiting, no delays.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Security sx={{ fontSize: 60, color: '#764ba2', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Privacy First
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your data is never stored. On-demand analysis only, no surveillance.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <VerifiedUser sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  90+ Detection Patterns
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Specialized engines for grooming, cyberbullying, deepfakes, and more.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Analytics sx={{ fontSize: 60, color: '#ff6f00', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Multi-Modal Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyze text, images, and videos. Instagram reel frame extraction included.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Support sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Expert Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get help from safety experts. Priority support for premium plans.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Group sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Built for Protection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Designed with parents, educators, and law enforcement in mind.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* FAQ Section */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
            Frequently Asked Questions
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'left', height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Can I try before buying?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yes! Start with our Free plan (5 analyses/month) or try Family/Premium with a 14-day free trial.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'left', height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Can I cancel anytime?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absolutely. No contracts, no commitments. Cancel anytime from your account settings.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'left', height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  What payment methods do you accept?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and ACH for enterprise plans.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'left', height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Do you offer discounts for schools?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yes! Schools get special pricing. Contact sales for volume discounts and multi-year contracts.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* CTA */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Paper elevation={12} sx={{ p: 5, bgcolor: '#667eea', color: 'white', borderRadius: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Ready to Protect Your Loved Ones?
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }}>
              Start your free trial today. No credit card required.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'scale(1.05)'
                }
              }}
              onClick={() => navigate('/')}
            >
              Get Started Free
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default PricingPage;
