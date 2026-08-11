'use client';

import { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Avatar, 
  Menu, MenuItem, IconButton, Chip
} from '@mui/material';
import { 
  Dashboard, Business, Analytics, People, 
  ExitToApp, AccountCircle, Settings, Assignment, CloudQueue, Speed, Category, WhatsApp 
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { User } from '../types';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'COMPANY_ADMIN': return 'warning';
      case 'MANAGER': return 'info';
      default: return 'default';
    }
  };

  return (
    <AppBar position="static" elevation={0} className="sap-shell-header" sx={{ 
      background: '#0070f2',
      height: '3rem',
      minHeight: '3rem'
    }}>
      <Toolbar sx={{ minHeight: '3rem !important', height: '3rem' }}>
        <Typography variant="h6" component="div" sx={{ 
          flexGrow: 1, 
          fontWeight: 400,
          fontSize: '1.125rem',
          color: 'white'
        }}>
          UXFLOW SAP Timesheet Portal
        </Typography>

        {user && (
          <>
            {/* Navigation Buttons - Demo Only */}
            {user.email === 'demo@uxflow.com' && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Button 
                  color="inherit" 
                  startIcon={<Dashboard />}
                  onClick={() => router.push('/dashboard')}
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Analytics />}
                  onClick={() => router.push('/manager')}
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  Gerencial
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Analytics />}
                  onClick={() => router.push('/analytics')}
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  Analytics SAP
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Assignment />}
                  onClick={() => router.push('/workflows')}
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  Workflows
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Business />}
                  onClick={() => router.push('/projects')}
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  Projetos SAP
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<People />}
                  onClick={() => router.push('/professionals')}
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  Profissionais
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<CloudQueue />}
                  onClick={() => router.push('/finops')}
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  FinOps BTP
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Speed />}
                  onClick={() => router.push('/performance')}
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  Performance
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Category />}
                  onClick={() => router.push('/activities')}
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  Atividades
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<WhatsApp />}
                  onClick={() => router.push('/whatsapp')}
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  WhatsApp
                </Button>
              </Box>
            )}

            {/* User Menu */}
            <Box display="flex" alignItems="center" ml={2}>
              <Chip 
                label={user.role.replace('_', ' ')}
                size="small"
                sx={{ 
                  mr: 2, 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '0.75rem',
                  height: '1.5rem'
                }}
              />
              
              <IconButton
                onClick={handleMenuClick}
                sx={{ 
                  color: 'white',
                  p: 0.5
                }}
              >
                <Avatar sx={{ 
                  width: 28, 
                  height: 28, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '0.875rem'
                }}>
                  {user.name?.charAt(0)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="subtitle2">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {typeof user.company === 'string' ? user.company : user.company?.name || 'N/A'}
                    </Typography>
                  </Box>
                </MenuItem>
                
                <MenuItem onClick={handleMenuClose}>
                  <AccountCircle sx={{ mr: 1 }} />
                  Perfil
                </MenuItem>
                
                <MenuItem onClick={handleMenuClose}>
                  <Settings sx={{ mr: 1 }} />
                  Configurações
                </MenuItem>
                
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Sair
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}

        {!user && (
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={() => router.push('/login')}
            sx={{
              fontSize: '0.875rem',
              fontWeight: 400,
              textTransform: 'none',
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}