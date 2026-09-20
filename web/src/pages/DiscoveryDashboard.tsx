import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Alert,
  Fade,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PublicIcon from '@mui/icons-material/Public';
import TimerIcon from '@mui/icons-material/Timer';
import { Tournament } from '../types/tournament.ts';
import { TournamentCard } from '../components/TournamentCard.tsx';
import { TournamentMap } from '../components/TournamentMap.tsx';
import { FilterBar } from '../components/FilterBar.tsx';
import { LiveNotificationSnackbar } from '../components/LiveNotificationSnackbar.tsx';
import { useOptimisticRsvp } from '../hooks/useOptimisticRsvp.ts';
import { useTournamentWebSocket } from '../hooks/useTournamentWebSocket.ts';

// Initial fallback mock data so UI renders instantly even before API Gateway is loaded
const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tourn-vcu-1',
    tournamentName: 'VCU Open Badminton Championship 2026',
    hostUniversity: 'Virginia Commonwealth University',
    eventLocation: 'UVA Memorial Gymnasium, 210 Emmet St S, Charlottesville, VA 22903',
    location: { type: 'Point', coordinates: [-78.5080, 38.0356] },
    registrationDeadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    rideFormDeadline: new Date(Date.now() + 86400000 * 1.5).toISOString(),
    isOpenTournament: true,
    registrationUrl: 'https://forms.gle/vcuOpen2026Mock',
    rsvpCount: 28,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tourn-umd-2',
    tournamentName: 'UMD Terrapin Invitational 2026',
    hostUniversity: 'University of Maryland',
    eventLocation: 'Eppley Recreation Center, 4128 Valley Dr, College Park, MD 20742',
    location: { type: 'Point', coordinates: [-76.9426, 38.9897] },
    registrationDeadline: new Date(Date.now() + 86400000 * 6).toISOString(),
    rideFormDeadline: new Date(Date.now() + 86400000 * 4).toISOString(),
    isOpenTournament: true,
    registrationUrl: 'https://forms.gle/umdTerps2026Mock',
    rsvpCount: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tourn-towson-3',
    tournamentName: 'Towson Tiger Smash Open',
    hostUniversity: 'Towson University',
    eventLocation: 'Burdick Hall Gym, 8000 York Rd, Towson, MD 21252',
    location: { type: 'Point', coordinates: [-76.6111, 39.3928] },
    registrationDeadline: new Date(Date.now() + 86400000 * 9).toISOString(),
    isOpenTournament: true,
    registrationUrl: 'https://linktr.ee/towsonubc',
    rsvpCount: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tourn-umbc-4',
    tournamentName: 'UMBC Retriever Collegiate Classic',
    hostUniversity: 'UMBC',
    eventLocation: 'RAC Arena, 1000 Hilltop Cir, Baltimore, MD 21250',
    location: { type: 'Point', coordinates: [-76.7136, 39.2556] },
    registrationDeadline: new Date(Date.now() + 86400000 * 12).toISOString(),
    isOpenTournament: false,
    registrationUrl: 'https://forms.gle/umbcRetriever2026',
    rsvpCount: 31,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tourn-jhu-5',
    tournamentName: 'Johns Hopkins Spring Open',
    hostUniversity: 'Johns Hopkins University',
    eventLocation: 'Ralph S. O\'Connor Center, 3400 N Charles St, Baltimore, MD 21218',
    location: { type: 'Point', coordinates: [-76.6205, 39.3299] },
    registrationDeadline: new Date(Date.now() + 86400000 * 14).toISOString(),
    isOpenTournament: true,
    registrationUrl: 'https://linktr.ee/jhuttc',
    rsvpCount: 19,
    createdAt: new Date().toISOString(),
  },
];

interface DiscoveryDashboardProps {
  isWsConnected: boolean;
  onTotalChange: (total: number) => void;
}

export const DiscoveryDashboard: React.FC<DiscoveryDashboardProps> = ({
  onTotalChange,
}) => {
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [openOnly, setOpenOnly] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [newAlertTournament, setNewAlertTournament] = useState<Tournament | null>(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

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

      const matchesOpen = openOnly ? t.isOpenTournament : true;
      const matchesUni = selectedUniversity ? t.hostUniversity === selectedUniversity : true;

      return matchesSearch && matchesOpen && matchesUni;
    });
  }, [tournaments, searchQuery, openOnly, selectedUniversity]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Top Notification Banner if Optimistic RSVP fails */}
      {errorMessage && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
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
                Active Tournaments in DMV
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
                Open to All Athletes (Non-Collegiate)
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
                Earliest Registration Closing
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
        Upcoming Tournaments ({filteredTournaments.length})
      </Typography>

      <Grid container spacing={3}>
        {filteredTournaments.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.id}>
            <Fade in timeout={400}>
              <div>
                <TournamentCard
                  tournament={t}
                  isRsvpd={rsvpdIds.has(t.id)}
                  onRsvp={handleRsvp}
                />
              </div>
            </Fade>
          </Grid>
        ))}
      </Grid>

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

