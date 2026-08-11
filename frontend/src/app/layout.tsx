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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>UXFLOW SAP Timesheet Portal</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          
          {/* SAP Fiori Shell Structure */}
          <div className="sap-shell">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="sap-shell-content">
              {children}
            </main>

            {/* Footer */}
            <footer className="sap-shell-footer">
              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'inherit' }}>
                © 2024 UXFLOW - Software Engineering & Cloud Solutions. 
                Portal SAP Timesheet é propriedade intelectual da UXFLOW.
              </Typography>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}