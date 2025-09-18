'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography } from '@mui/material';
import theme from '../theme/theme';
import Header from '../components/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          
          {/* Header */}
          <Header />

          {/* Main Content */}
          <Box component="main" sx={{ minHeight: 'calc(100vh - 64px)' }}>
            {children}
          </Box>

          {/* Footer */}
          <Box 
            component="footer" 
            sx={{ 
              bgcolor: '#1976d2', 
              color: 'white', 
              py: 3, 
              textAlign: 'center' 
            }}
          >
            <Typography variant="body2">
              © 2024 UXFLOW - Software Engineering & Cloud Solutions. Todos os direitos reservados. Portal SAP Timesheet é propriedade intelectual da UXFLOW.
            </Typography>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}