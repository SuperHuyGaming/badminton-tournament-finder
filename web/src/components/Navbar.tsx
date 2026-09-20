import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { BadmintonIcon } from './BadmintonIcon';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import GitHubIcon from '@mui/icons-material/GitHub';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
  isWsConnected: boolean;
  isPolling?: boolean;
  totalTournaments: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onToggleTheme,
  isWsConnected,
  isPolling = false,
  totalTournaments,
}) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (event: any) => {
    i18n.changeLanguage(event.target.value);
  };

  const getConnectionStatus = () => {
    if (isWsConnected) {
      return { icon: <WifiIcon fontSize="small" />, label: t('navbar.status.live'), color: 'success' as const, tooltip: t('navbar.status.live_tooltip') };
    }
    if (isPolling) {
      return { icon: <SwapCallsIcon fontSize="small" />, label: t('navbar.status.polling'), color: 'warning' as const, tooltip: t('navbar.status.polling_tooltip') };
    }
    return { icon: <WifiOffIcon fontSize="small" />, label: t('navbar.status.offline'), color: 'default' as const, tooltip: t('navbar.status.offline_tooltip') };
  };

  const status = getConnectionStatus();

  return (
    <AppBar position="sticky" color="inherit" elevation={1} sx={{ backdropFilter: 'blur(8px)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
          <BadmintonIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {t('navbar.title')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('navbar.subtitle')}
            </Typography>
          </Box>
        </Box>

        {/* Indicators & Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title={status.tooltip}>
            <Chip
              icon={status.icon}
              label={status.label}
              size="small"
              color={status.color}
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.75rem' }}
            />
          </Tooltip>

          <Chip
            label={t('navbar.tournaments_count', { count: totalTournaments })}
            size="small"
            color="primary"
            sx={{ fontWeight: 600 }}
          />

          <FormControl variant="standard" sx={{ minWidth: 60, ml: 1 }}>
            <Select
              value={i18n.resolvedLanguage || 'en'}
              onChange={handleLanguageChange}
              disableUnderline
              IconComponent={() => <TranslateIcon fontSize="small" sx={{ ml: 0.5, color: 'text.secondary' }} />}
              sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.secondary' }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="es">ES</MenuItem>
            </Select>
          </FormControl>

          <IconButton onClick={onToggleTheme} color="inherit" size="small">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* GitHub Repo */}
          <Tooltip title={t('navbar.github_tooltip')}>
            <IconButton
              component="a"
              href="https://github.com/SuperHuyGaming/badminton-tournament-finder"
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
