import { useState, useCallback } from 'react';
import { Tournament } from '../types/tournament.ts';

interface UseOptimisticRsvpResult {
  rsvpdIds: Set<string>;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleRsvp: (tournament: Tournament) => Promise<void>;
  clearError: () => void;
}

export const useOptimisticRsvp = (
  onSuccessUpdate?: (updatedTournament: Tournament) => void
): UseOptimisticRsvpResult => {
  const [rsvpdIds, setRsvpdIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRsvp = useCallback(
    async (tournament: Tournament) => {
      const tournamentId = tournament.id;
      if (rsvpdIds.has(tournamentId)) return;

      // 1. Optimistic Update: Immediately mark as RSVP'd and increment count
      setRsvpdIds((prev) => new Set(prev).add(tournamentId));
      if (onSuccessUpdate) {
        onSuccessUpdate({
          ...tournament,
          rsvpCount: (tournament.rsvpCount || 0) + 1,
        });
      }

      setIsSubmitting(true);
      const apiGatewayUrl = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';

      try {
        const response = await fetch(`${apiGatewayUrl}/api/v1/tournaments/${tournamentId}/rsvp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const data: Tournament = await response.json();
        if (onSuccessUpdate) {
          onSuccessUpdate(data);
        }
      } catch (err: unknown) {
        // 2. Rollback on failure
        console.error('Optimistic RSVP failed, rolling back UI state:', err);
        setRsvpdIds((prev) => {
          const next = new Set(prev);
          next.delete(tournamentId);
          return next;
        });
        if (onSuccessUpdate) {
          onSuccessUpdate(tournament); // rollback to original state
        }
        setErrorMessage(
          'Could not complete RSVP. The tournament may have reached capacity or deadline passed.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [rsvpdIds, onSuccessUpdate]
  );

  const clearError = () => setErrorMessage(null);

  return { rsvpdIds, isSubmitting, errorMessage, handleRsvp, clearError };
};

