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
    <AppBar position="static" elevation={0} sx={{ 
      background: 'linear-gradient(45deg, #1976d2, #42a5f5)' 
    }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          UXFLOW Timesheet
        </Typography>

        {user && (
          <>
            {/* Navigation Buttons - Demo Only */}
            {user.email === 'demo@uxflow.com' && (
              <>
                <Button 
                  color="inherit" 
                  startIcon={<Dashboard />}
                  onClick={() => router.push('/dashboard')}
                  sx={{ mr: 1 }}
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Analytics />}
                  onClick={() => router.push('/manager')}
                  sx={{ mr: 1 }}
                >
                  Gerencial
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Analytics />}
                  onClick={() => router.push('/analytics')}
                  sx={{ mr: 1 }}
                >
                  Analytics SAP
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Assignment />}
                  onClick={() => router.push('/workflows')}
                  sx={{ mr: 1 }}
                >
                  Workflows
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Business />}
                  onClick={() => router.push('/projects')}
                  sx={{ mr: 1 }}
                >
                  Projetos SAP
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<People />}
                  onClick={() => router.push('/professionals')}
                  sx={{ mr: 1 }}
                >
                  Profissionais
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<CloudQueue />}
                  onClick={() => router.push('/finops')}
                  sx={{ mr: 1 }}
                >
                  FinOps BTP
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Speed />}
                  onClick={() => router.push('/performance')}
                  sx={{ mr: 1 }}
                >
                  Performance
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<Category />}
                  onClick={() => router.push('/activities')}
                  sx={{ mr: 1 }}
                >
                  Atividades
                </Button>
                <Button 
                  color="inherit" 
                  startIcon={<WhatsApp />}
                  onClick={() => router.push('/whatsapp')}
                  sx={{ mr: 1 }}
                >
                  WhatsApp
                </Button>
              </>
            )}

            {/* User Menu */}
            <Box display="flex" alignItems="center" ml={2}>
              <Chip 
                label={user.role.replace('_', ' ')}
                color={getRoleColor(user.role)}
                size="small"
                sx={{ mr: 2, color: 'white' }}
              />
              
              <IconButton
                onClick={handleMenuClick}
                sx={{ color: 'white' }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
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
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}