import { createTheme } from '@mui/material/styles';

export const getBadmintonTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#059669', // Badminton Emerald Green
        light: '#34D399',
        dark: '#065F46',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#3B82F6', // Dynamic Athletic Blue
        light: '#60A5FA',
        dark: '#1D4ED8',
      },
      warning: {
        main: '#F59E0B', // Deadline Urgency Amber
      },
      background: {
        default: mode === 'dark' ? '#0B0F19' : '#F8FAFC',
        paper: mode === 'dark' ? '#111827' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#F9FAFB' : '#0F172A',
        secondary: mode === 'dark' ? '#9CA3AF' : '#64748B',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h5: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: mode === 'dark'
                ? '0 12px 24px -4px rgba(0, 0, 0, 0.6)'
                : '0 12px 24px -4px rgba(15, 23, 42, 0.08)',
            },
          },
        },
      },
    },
  });

