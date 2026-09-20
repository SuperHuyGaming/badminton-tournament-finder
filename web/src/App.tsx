import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { getBadmintonTheme } from './theme/theme.ts';
import { Navbar } from './components/Navbar.tsx';
import { DiscoveryDashboard } from './pages/DiscoveryDashboard.tsx';
import { useTournamentWebSocket } from './hooks/useTournamentWebSocket.ts';

export const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [totalTournaments, setTotalTournaments] = useState<number>(0);

  const theme = useMemo(() => getBadmintonTheme(mode), [mode]);
  const { isConnected } = useTournamentWebSocket();

  const handleToggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Navbar
          mode={mode}
          onToggleTheme={handleToggleTheme}
          isWsConnected={isConnected}
          totalTournaments={totalTournaments}
        />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <DiscoveryDashboard
            isWsConnected={isConnected}
            onTotalChange={setTotalTournaments}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

