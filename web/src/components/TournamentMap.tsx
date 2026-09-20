import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Tournament } from '../types/tournament.ts';

// Fix for default Leaflet icon paths in Vite/Webpack bundlers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface TournamentMapProps {
  tournaments: Tournament[];
  onSelectTournament?: (tournament: Tournament) => void;
}

export const TournamentMap: React.FC<TournamentMapProps> = ({ tournaments }) => {
  // DMV Regional Centroid (approx Washington D.C. area)
  const defaultCenter: [number, number] = [38.9072, -77.0369];

  return (
    <Paper
      elevation={2}
      sx={{
        overflow: 'hidden',
        borderRadius: 3,
        height: 380,
        position: 'relative',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {tournaments.map((t) => {
          if (!t.location || !t.location.coordinates) return null;
          const [lng, lat] = t.location.coordinates;

          return (
            <Marker key={t.id} position={[lat, lng]} icon={defaultIcon}>
              <Popup>
                <Box sx={{ p: 0.5, maxWidth: 220 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {t.tournamentName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                    {t.hostUniversity}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', mb: 1 }}>
                    {t.eventLocation}
                  </Typography>
                  {t.registrationUrl && (
                    <a
                      href={t.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#059669', fontWeight: 600, fontSize: '0.75rem' }}
                    >
                      Registration Form →
                    </a>
                  )}
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Paper>
  );
};

