import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import GitHubIcon from '@mui/icons-material/GitHub';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';

interface NavbarProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
  isWsConnected: boolean;
  totalTournaments: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onToggleTheme,
  isWsConnected,
  totalTournaments,
}) => {
  return (
    <AppBar position="sticky" color="inherit" elevation={1} sx={{ backdropFilter: 'blur(8px)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SportsTennisIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Badminton Tournament Finder
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-Time Collegiate Circuit Intelligence
            </Typography>
          </Box>
        </Box>

        {/* Indicators & Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Real-Time WebSocket Connection Badge */}
          <Tooltip title={isWsConnected ? 'Live WebSocket Connected (STOMP)' : 'Connecting to Live Stream...'}>
            <Chip
              icon={isWsConnected ? <WifiIcon fontSize="small" /> : <WifiOffIcon fontSize="small" />}
              label={isWsConnected ? 'LIVE FEED' : 'OFFLINE'}
              size="small"
              color={isWsConnected ? 'success' : 'default'}
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.75rem' }}
            />
          </Tooltip>

          {/* Active Count */}
          <Chip
            label={`${totalTournaments} Tournaments`}
            size="small"
            color="primary"
            sx={{ fontWeight: 600 }}
          />

          {/* Theme Toggle */}
          <IconButton onClick={onToggleTheme} color="inherit" size="small">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* GitHub Repo */}
          <Tooltip title="View on GitHub">
            <IconButton
              component="a"
              href="https://github.com/your-org/badminton-tournament-finder"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              size="small"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

