import React from 'react';
import { Snackbar, Alert, Typography, Box, Button } from '@mui/material';
import { BadmintonIcon } from './BadmintonIcon';
import { Tournament } from '../types/tournament.ts';

interface LiveNotificationSnackbarProps {
  tournament: Tournament | null;
  open: boolean;
  onClose: () => void;
  onView: (tournament: Tournament) => void;
}

export const LiveNotificationSnackbar: React.FC<LiveNotificationSnackbarProps> = ({
  tournament,
  open,
  onClose,
  onView,
}) => {
  if (!tournament) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={8000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        variant="filled"
        icon={<BadmintonIcon fontSize="inherit" />}
        sx={{ width: '100%', borderRadius: 2, boxShadow: 6 }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              onView(tournament);
              onClose();
            }}
          >
            VIEW
          </Button>
        }
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            New Tournament Discovered!
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', opacity: 0.9 }}>
            {tournament.tournamentName} • {tournament.hostUniversity}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

