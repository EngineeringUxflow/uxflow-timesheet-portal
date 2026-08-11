'use client';

import { createTheme } from '@mui/material/styles';

// SAP Fiori Design System Colors
const sapColors = {
  // SAP Primary Colors
  sapBlue: '#0070f2',
  sapDarkBlue: '#0854a0',
  sapLightBlue: '#74b3f7',
  
  // SAP Secondary Colors
  sapOrange: '#ff8c00',
  sapGreen: '#30914c',
  sapRed: '#bb0000',
  sapYellow: '#f9b500',
  
  // SAP Neutral Colors
  sapGray1: '#fafafa',
  sapGray2: '#f7f7f7',
  sapGray3: '#ededed',
  sapGray4: '#d9d9d9',
  sapGray5: '#89919a',
  sapGray6: '#6a6d70',
  sapGray7: '#32363a',
  
  // SAP Semantic Colors
  sapSuccess: '#30914c',
  sapError: '#bb0000',
  sapWarning: '#f9b500',
  sapInfo: '#0070f2',
};

const theme = createTheme({
  palette: {
    primary: {
      main: sapColors.sapBlue,
      light: sapColors.sapLightBlue,
      dark: sapColors.sapDarkBlue,
      contrastText: '#ffffff',
    },
    secondary: {
      main: sapColors.sapOrange,
      light: '#ffb366',
      dark: '#cc7000',
      contrastText: '#ffffff',
    },
    success: {
      main: sapColors.sapSuccess,
      light: '#66b366',
      dark: '#267326',
    },
    error: {
      main: sapColors.sapError,
      light: '#d93333',
      dark: '#990000',
    },
    warning: {
      main: sapColors.sapWarning,
      light: '#ffc733',
      dark: '#cc9100',
    },
    info: {
      main: sapColors.sapInfo,
      light: sapColors.sapLightBlue,
      dark: sapColors.sapDarkBlue,
    },
    background: {
      default: sapColors.sapGray1,
      paper: '#ffffff',
    },
    text: {
      primary: sapColors.sapGray7,
      secondary: sapColors.sapGray6,
    },
    divider: sapColors.sapGray3,
  },
  typography: {
    // SAP Fiori uses 72 font family
    fontFamily: '"72", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 300,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 300,
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.167,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
      lineHeight: 1.235,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
      lineHeight: 1.334,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
  },
  shape: {
    borderRadius: 4, // SAP Fiori uses smaller border radius
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${sapColors.sapGray3}`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.15s ease-in-out',
          '&:hover': {
            boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 400,
          fontSize: '0.875rem',
          padding: '8px 16px',
          minHeight: '2.25rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: sapColors.sapBlue,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            '& fieldset': {
              borderColor: sapColors.sapGray4,
            },
            '&:hover fieldset': {
              borderColor: sapColors.sapGray5,
            },
            '&.Mui-focused fieldset': {
              borderColor: sapColors.sapBlue,
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontSize: '0.75rem',
          height: '1.5rem',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: sapColors.sapGray2,
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
    },
  },
});

export default theme;