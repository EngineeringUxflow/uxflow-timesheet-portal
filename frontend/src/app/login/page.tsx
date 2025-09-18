'use client';

import { useState } from 'react';
import { 
  Box, Container, Paper, TextField, Button, Typography, 
  Alert, Card, CardContent, IconButton, InputAdornment,
  LinearProgress, Grid
} from '@mui/material';
import { 
  Business, Person, Lock, Visibility, VisibilityOff, 
  Email, CheckCircle, CloudQueue, Security
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
        
        // Demo access for client presentations
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

  const handleRegister = async () => {
    if (!registerData.companyName || !registerData.email || !registerData.name || !registerData.password) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Senhas não coincidem');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Empresa cadastrada com sucesso! Faça login.');
        setActiveTab(0);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Erro ao cadastrar empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recoveryData)
      });
      
      if (response.ok) {
        setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
        setActiveTab(0);
      } else {
        setError('Email não encontrado');
      }
    } catch (error) {
      setError('Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #3182ce 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
        opacity: 0.3
      }
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6}>
            <Box sx={{ color: 'white', mb: { xs: 4, md: 0 } }}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                UXFLOW
              </Typography>
              <Typography variant="h4" sx={{ opacity: 0.9, mb: 3 }}>
                SAP Timesheet Portal
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, mb: 4 }}>
                Software Engineering & Cloud Solutions
              </Typography>
              
              {/* Features */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CloudQueue sx={{ color: '#63b3ed' }} />
                  <Typography>Integração SAP BTP + AWS/Azure/GCP</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Security sx={{ color: '#63b3ed' }} />
                  <Typography>Portal Seguro Multi-Tenant</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircle sx={{ color: '#38a169' }} />
                  <Typography>Analytics Avançados de Projetos</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={24} sx={{ 
              borderRadius: 4, 
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {/* Header */}
              <Box sx={{ 
                background: 'linear-gradient(135deg, #1a365d 0%, #3182ce 100%)',
                color: 'white',
                p: 3,
                textAlign: 'center'
              }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Portal SAP Timesheet
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Acesse sua conta para continuar
                </Typography>
              </Box>



              <Box sx={{ p: 4 }}>
                {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                {/* LOGIN FORM */}
                <Box>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: '#1a365d' }} />
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Senha"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      sx={{ mb: 4 }}
                      InputProps={{
                        startAdornment: <Lock sx={{ mr: 1, color: '#1a365d' }} />,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
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
                        mb: 3, 
                        py: 1.5, 
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #1a365d 0%, #3182ce 100%)',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #2d3748 0%, #2b6cb0 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(26, 54, 93, 0.3)'
                        }
                      }}
                    >
                      {loading ? 'Entrando...' : 'Entrar'}
                    </Button>

                    {/* Demo Credentials */}
                    <Card sx={{ mt: 3, bgcolor: '#f7fafc', border: '1px solid #e2e8f0' }}>
                      <CardContent sx={{ py: 2 }}>
                        <Typography variant="subtitle2" gutterBottom color="#1a365d" fontWeight={600}>
                          🚀 Credenciais Demo:
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="body2" color="#4a5568">
                            <strong>Email:</strong> demo@uxflow.com
                          </Typography>
                          <Typography variant="body2" color="#4a5568">
                            <strong>Senha:</strong> demo123
                          </Typography>
                        </Box>
                        <Button 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            mt: 2,
                            borderColor: '#3182ce', 
                            color: '#3182ce',
                            '&:hover': { bgcolor: '#3182ce', color: 'white' }
                          }}
                          onClick={() => setLoginData({email: 'demo@uxflow.com', password: 'demo123'})}
                        >
                          Preencher Automaticamente
                        </Button>
                      </CardContent>
                    </Card>

                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}