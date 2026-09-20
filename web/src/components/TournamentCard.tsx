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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoIcon from '@mui/icons-material/Info';
import { formatDistanceToNow, isPast, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Tournament } from '../types/tournament.ts';

interface TournamentCardProps {
  tournament: Tournament;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament
}) => {
  const { t, i18n } = useTranslation();
  const regDeadline = parseISO(tournament.registrationDeadline);
  const isDeadlinePassed = isPast(regDeadline);

  // Time remaining string
  const timeRemaining = isDeadlinePassed
    ? t('card.registration_closed')
    : t('card.closes', { time: formatDistanceToNow(regDeadline, { addSuffix: true }) });

  const hostInitials = tournament.hostUniversity
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 3)
    .toUpperCase();

  // Get localized description based on current language
  const currentLang = i18n.resolvedLanguage || 'en';
  const localizedDesc = tournament.localizedDescriptions?.[currentLang] || tournament.localizedDescriptions?.['en'] || null;

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
            label={tournament.isOpenTournament ? t('card.open_tournament') : t('card.collegiate_only')}
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

        {/* Localized Description */}
        {localizedDesc && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mb: 1.5 }}>
            <InfoIcon fontSize="small" sx={{ color: 'text.secondary', mt: 0.2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {localizedDesc}
            </Typography>
          </Box>
        )}

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
                {t('card.ride_form', { time: formatDistanceToNow(parseISO(tournament.rideFormDeadline), { addSuffix: true }) })}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {/* External Registration Link */}
        <Button
          component="a"
          href={tournament.registrationUrl || tournament.sourceUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          size="medium"
          fullWidth
          variant="contained"
          color="primary"
          endIcon={<OpenInNewIcon fontSize="small" />}
          disabled={isDeadlinePassed}
          sx={{ fontWeight: 600, borderRadius: 2 }}
        >
          {isDeadlinePassed ? t('card.registration_closed') : t('card.go_to_registration')}
        </Button>
      </CardActions>
    </Card>
  );
};
