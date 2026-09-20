import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { formatDistanceToNow, isPast, parseISO } from 'date-fns';
import { Tournament } from '../types/tournament.ts';

interface TournamentCardProps {
  tournament: Tournament;
  isRsvpd: boolean;
  onRsvp: (tournament: Tournament) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  isRsvpd,
  onRsvp,
}) => {
  const regDeadline = parseISO(tournament.registrationDeadline);
  const isDeadlinePassed = isPast(regDeadline);

  // Time remaining string
  const timeRemaining = isDeadlinePassed
    ? 'Registration Closed'
    : `Closes ${formatDistanceToNow(regDeadline, { addSuffix: true })}`;

  const hostInitials = tournament.hostUniversity
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 3)
    .toUpperCase();

  return (
    <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header: University & Status Chips */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34, fontSize: '0.85rem', fontWeight: 700 }}>
              {hostInitials}
            </Avatar>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {tournament.hostUniversity}
            </Typography>
          </Box>

          <Chip
            label={tournament.isOpenTournament ? 'OPEN TOURNAMENT' : 'COLLEGIATE ONLY'}
            size="small"
            color={tournament.isOpenTournament ? 'success' : 'info'}
            variant="outlined"
            sx={{ fontSize: '0.68rem', fontWeight: 700 }}
          />
        </Box>

        {/* Tournament Name */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
          {tournament.tournamentName}
        </Typography>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mb: 1.5 }}>
          <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', mt: 0.2 }} />
          <Typography variant="body2" color="text.secondary">
            {tournament.eventLocation}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Deadlines & Carpool Status */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Registration Deadline */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <AccessTimeIcon fontSize="small" sx={{ color: isDeadlinePassed ? 'error.main' : 'warning.main' }} />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: isDeadlinePassed ? 'error.main' : 'warning.main',
              }}
            >
              {timeRemaining}
            </Typography>
          </Box>

          {/* Carpool / Ride-Share Deadline */}
          {tournament.rideFormDeadline && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <DirectionsCarIcon fontSize="small" sx={{ color: 'secondary.main' }} />
              <Typography variant="caption" color="text.secondary">
                Ride Form: {formatDistanceToNow(parseISO(tournament.rideFormDeadline), { addSuffix: true })}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        {/* Optimistic RSVP Button */}
        <Button
          variant={isRsvpd ? 'contained' : 'outlined'}
          color={isRsvpd ? 'success' : 'primary'}
          size="small"
          startIcon={isRsvpd ? <CheckCircleIcon /> : <HowToRegIcon />}
          onClick={() => onRsvp(tournament)}
          disabled={isDeadlinePassed}
          sx={{ fontWeight: 600 }}
        >
          {isRsvpd ? 'Signed Up' : `RSVP (${tournament.rsvpCount || 0})`}
        </Button>

        {/* External Registration Link */}
        {tournament.registrationUrl && (
          <Button
            component="a"
            href={tournament.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            endIcon={<OpenInNewIcon fontSize="small" />}
          >
            Register Form
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

