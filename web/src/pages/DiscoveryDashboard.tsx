import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Alert,
  Fade,
  Button,
  CircularProgress
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PublicIcon from '@mui/icons-material/Public';
import TimerIcon from '@mui/icons-material/Timer';
import { Tournament } from '../types/tournament.ts';
import { TournamentCard } from '../components/TournamentCard.tsx';
import { TournamentMap } from '../components/TournamentMap.tsx';
import { FilterBar } from '../components/FilterBar.tsx';
import { LiveNotificationSnackbar } from '../components/LiveNotificationSnackbar.tsx';
import { useTournamentWebSocket } from '../hooks/useTournamentWebSocket.ts';

interface DiscoveryDashboardProps {
  isWsConnected: boolean;
  onTotalChange: (total: number) => void;
}

export const DiscoveryDashboard: React.FC<DiscoveryDashboardProps> = ({
  onTotalChange,
}) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [openOnly, setOpenOnly] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [newAlertTournament, setNewAlertTournament] = useState<Tournament | null>(null);
  const { t } = useTranslation();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const fetchTournaments = useCallback(async (cursor: string | null = null, reset: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = new URL('http://localhost:8080/api/v1/tournaments');
      if (cursor) {
        url.searchParams.append('cursor', cursor);
      }
      url.searchParams.append('openOnly', openOnly.toString());
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch tournaments');
      }
      const data = await response.json();
      
      setTournaments(prev => reset ? data.data : [...prev, ...data.data]);
      setNextCursor(data.nextCursor);
      setHasNext(data.hasNext);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      setError('Failed to load tournaments from the server.');
    } finally {
      setIsLoading(false);
    }
  }, [openOnly]);

  useEffect(() => {
    fetchTournaments(null, true);
  }, [fetchTournaments]);

  // Optimistic RSVP Hook
  const { rsvpdIds, handleRsvp, errorMessage, clearError } = useOptimisticRsvp(
    (updatedTournament) => {
      setTournaments((prev) =>
        prev.map((t) => (t.id === updatedTournament.id ? updatedTournament : t))
      );
    }
  );

  // Live WebSocket Integration
  useTournamentWebSocket((newTournament) => {
    setTournaments((prev) => {
      const exists = prev.some((t) => t.id === newTournament.id);
      if (exists) {
        return prev.map((t) => (t.id === newTournament.id ? newTournament : t));
      }
      return [newTournament, ...prev];
    });
    setNewAlertTournament(newTournament);
    setIsSnackbarOpen(true);
  });

  useEffect(() => {
    onTotalChange(tournaments.length);
  }, [tournaments, onTotalChange]);

  // List of unique universities for filter
  const universities = useMemo(() => {
    return Array.from(new Set(tournaments.map((t) => t.hostUniversity))).sort();
  }, [tournaments]);

  // Filtered tournaments
  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      const matchesSearch =
        t.tournamentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.eventLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.hostUniversity.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUni = selectedUniversity ? t.hostUniversity === selectedUniversity : true;

      return matchesSearch && matchesUni;
    });
  }, [tournaments, searchQuery, selectedUniversity]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {errorMessage && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* KPI Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <EventAvailableIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {tournaments.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('dashboard.active_tournaments')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <PublicIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {tournaments.filter((t) => t.isOpenTournament).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('dashboard.open_to_all')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <TimerIcon sx={{ fontSize: 40, color: 'warning.main' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                48 Hours
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('dashboard.earliest_closing')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Interactive Map */}
      <Box sx={{ mb: 3.5 }}>
        <TournamentMap tournaments={filteredTournaments} />
      </Box>

      {/* Filter Controls */}
      <Box sx={{ mb: 3.5 }}>
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          openOnly={openOnly}
          onOpenOnlyToggle={() => setOpenOnly((prev) => !prev)}
          selectedUniversity={selectedUniversity}
          onUniversityChange={setSelectedUniversity}
          universities={universities}
        />
      </Box>

      {/* Tournaments Grid */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {t('dashboard.upcoming_tournaments', { count: filteredTournaments.length })}
      </Typography>

      <Grid container spacing={3}>
        {filteredTournaments.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.id}>
            <Fade in timeout={400}>
              <div>
                <TournamentCard
                  tournament={t}
                                  />
              </div>
            </Fade>
          </Grid>
        ))}
      </Grid>
      
      {/* Load More Button */}
      {hasNext && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => fetchTournaments(nextCursor, false)}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
          >
            {isLoading ? 'Loading...' : '{t('dashboard.load_more')}'}
          </Button>
        </Box>
      )}

      {/* Real-Time Live Notification Snackbar */}
      <LiveNotificationSnackbar
        tournament={newAlertTournament}
        open={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        onView={(t) => {
          console.log('Selected tournament from toast:', t);
        }}
      />
    </Container>
  );
};


