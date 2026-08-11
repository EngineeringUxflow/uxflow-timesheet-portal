'use client';

import { useState } from 'react';
import { 
  Box, Container, Paper, TextField, Button, Typography, 
  Alert, Card, CardContent, IconButton, InputAdornment,
  LinearProgress, Grid, Divider
} from '@mui/material';
import { 
  Business, Person, Lock, Visibility, VisibilityOff, 
  Email, CheckCircle, CloudQueue, Security, Schedule
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setError('Email e senha são obrigatórios');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.email === 'demo@uxflow.com') {
          router.push('/dashboard');
        } else {
          setError('Acesso restrito. Entre em contato para solicitar uma demonstração.');
          return;
        }
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#f7f7f7', // SAP Fiori background
      display: 'flex',
      alignItems: 'center',
      py: 4,
      fontFamily: '"72", "Helvetica Neue", Arial, sans-serif' // SAP 72 font
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - SAP Branding */}
          <Grid item xs={12} md={6}>
            <Box sx={{ color: '#0070f3', mb: { xs: 4, md: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Schedule sx={{ fontSize: 48, mr: 2, color: '#0070f3' }} />
                <Box>
                  <Typography variant="h3" fontWeight="600" sx={{ color: '#333333' }}>
                    UXFLOW
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#0070f3' }}>
                    Timesheet Portal
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h6" sx={{ color: '#666666', mb: 4, fontWeight: '400' }}>
                Enterprise SAP Solutions & Cloud Integration
              </Typography>
              
              {/* SAP Features */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '4px', 
                    background: '#e3f2fd', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <CloudQueue sx={{ color: '#0070f3', fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ color: '#333333', fontWeight: '400' }}>
                    SAP BTP Integration & Cloud Solutions
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '4px', 
                    background: '#e8f5e8', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Security sx={{ color: '#4caf50', fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ color: '#333333', fontWeight: '400' }}>
                    Enterprise Security & Multi-Tenant Architecture
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '4px', 
                    background: '#fff3e0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <CheckCircle sx={{ color: '#ff9800', fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ color: '#333333', fontWeight: '400' }}>
                    Advanced Project Analytics & Reporting
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Fiori Login Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ 
              borderRadius: '8px', // Fiori border radius
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid #d9d9d9', // Fiori border
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' // Subtle Fiori shadow
            }}>
              {/* Header with SAP Blue */}
              <Box sx={{ 
                background: '#0070f3', // SAP Blue
                color: 'white',
                p: 3,
                textAlign: 'center',
                position: 'relative'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #0070f3, #0040a0)' // SAP accent
                }} />
                
                <Schedule sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h5" fontWeight="600" gutterBottom>
                  UXFLOW Timesheet
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  SAP Project Management Portal
                </Typography>
              </Box>

              <Box sx={{ p: 4 }}>
                {loading && <LinearProgress sx={{ mb: 2, borderRadius: '2px' }} />}
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: '4px',
                      border: '1px solid #d32f2f',
                      backgroundColor: '#ffebee'
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* LOGIN FORM */}
                <Box>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px', // Fiori input radius
                        '&:hover fieldset': {
                          borderColor: '#0070f3'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0070f3',
                          borderWidth: '2px'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#0070f3'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#6a6a6a' }} />
                        </InputAdornment>
                      )
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    sx={{ 
                      mb: 4,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '&:hover fieldset': {
                          borderColor: '#0070f3'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0070f3',
                          borderWidth: '2px'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#0070f3'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#6a6a6a' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{ color: '#6a6a6a' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{ 
                      py: 1.5,
                      borderRadius: '4px', // Fiori button radius
                      background: '#0070f3', // SAP Blue
                      color: '#ffffff',
                      '&:hover': {
                        background: '#0040a0', // Darker SAP Blue
                        boxShadow: '0 4px 8px rgba(0, 112, 243, 0.3)'
                      },
                      '&:disabled': {
                        background: '#cccccc',
                        color: '#666666'
                      },
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: '600',
                      boxShadow: '0 2px 4px rgba(0, 112, 243, 0.2)'
                    }}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>

                  <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} />

                  {/* Demo Credentials - Fiori Style */}
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: '#f8f9fa', 
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ 
                      color: '#333333',
                      fontWeight: '600'
                    }}>
                      🎯 Credenciais Demo
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body2" sx={{ color: '#666666' }}>
                        <strong>Email:</strong> demo@uxflow.com
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666666' }}>
                        <strong>Senha:</strong> demo123
                      </Typography>
                    </Box>
                    <Button 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        mt: 2,
                        borderRadius: '4px',
                        borderColor: '#0070f3', 
                        color: '#0070f3',
                        textTransform: 'none',
                        fontWeight: '500',
                        '&:hover': { 
                          bgcolor: '#0070f3', 
                          color: 'white',
                          borderColor: '#0070f3'
                        }
                      }}
                      onClick={() => setLoginData({email: 'demo@uxflow.com', password: 'demo123'})}
                    >
                      Preencher Automaticamente
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Footer */}
              <Box sx={{
                p: 3,
                bgcolor: '#fafafa',
                textAlign: 'center',
                borderTop: '1px solid #e0e0e0'
              }}>
                <Typography variant="body2" sx={{ color: '#666666' }}>
                  © 2024 UXFLOW Consultoria • SAP Solutions
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}