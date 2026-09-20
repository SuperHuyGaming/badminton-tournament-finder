export interface GeoJsonPoint {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Tournament {
  id: string;
  tournamentName: string;
  hostUniversity: string;
  eventLocation: string;
  location?: GeoJsonPoint;
  distanceMeters?: number;
  registrationDeadline: string; // ISO 8601 string
  rideFormDeadline?: string | null;
  isOpenTournament: boolean;
  registrationUrl?: string | null;
  sourceUrl?: string | null;
  flyerImageUrl?: string | null;
  rsvpCount: number;
  createdAt: string;
}

export interface FilterCriteria {
  searchQuery: string;
  openOnly: boolean;
  maxDistanceKm: number;
  selectedUniversity: string;
}

