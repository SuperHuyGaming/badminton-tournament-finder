import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Tournament } from '../types/tournament.ts';

interface UseTournamentWebSocketResult {
  isConnected: boolean;
  latestEvent: Tournament | null;
  isPolling: boolean;
}

export const useTournamentWebSocket = (
  onNewTournament?: (tournament: Tournament) => void
): UseTournamentWebSocketResult => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [latestEvent, setLatestEvent] = useState<Tournament | null>(null);
  
  const clientRef = useRef<Client | null>(null);
  const seenTournamentIdsRef = useRef<Set<string>>(new Set());
  const pollingIntervalRef = useRef<number | null>(null);

  // Maintain WebSocket Connection
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_GATEWAY_URL || 'http://localhost:8080/ws';

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.debug('[STOMP]', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        console.info('Connected to STOMP WebSocket broker');

        client.subscribe('/topic/tournaments', (message) => {
          if (message.body) {
            try {
              const tournament: Tournament = JSON.parse(message.body);
              
              // Only process if we haven't seen it recently
              if (!seenTournamentIdsRef.current.has(tournament.id)) {
                seenTournamentIdsRef.current.add(tournament.id);
                setLatestEvent(tournament);
                if (onNewTournament) {
                  onNewTournament(tournament);
                }
                
                // Prevent memory leak by capping set size
                if (seenTournamentIdsRef.current.size > 500) {
                  const arr = Array.from(seenTournamentIdsRef.current).slice(-200);
                  seenTournamentIdsRef.current = new Set(arr);
                }
              }
            } catch (err) {
              console.error('Error parsing WebSocket message frame:', err);
            }
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.warn('Disconnected from STOMP WebSocket broker');
      },
      onStompError: (frame) => {
        console.error('STOMP protocol error:', frame.headers['message']);
        setIsConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [onNewTournament]);

  // HTTP Polling Fallback Logic
  useEffect(() => {
    // If connected, ensure polling is off
    if (isConnected) {
      setIsPolling(false);
      if (pollingIntervalRef.current) {
        window.clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // If disconnected, start polling
    setIsPolling(true);
    console.info('Initiating HTTP Polling Fallback...');

    const fetchLatestTournaments = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/tournaments?limit=10', {
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) return;

        const data = await response.json();
        const tournaments: Tournament[] = data.data || [];
        
        // Reverse so we process oldest first, triggering onNewTournament in chronological order
        const newTournaments = tournaments.filter(t => !seenTournamentIdsRef.current.has(t.id)).reverse();

        newTournaments.forEach(tournament => {
          seenTournamentIdsRef.current.add(tournament.id);
          setLatestEvent(tournament);
          if (onNewTournament) {
            onNewTournament(tournament);
          }
        });
      } catch (error) {
        console.error('HTTP Polling fetch failed:', error);
      }
    };

    // Poll every 10 seconds
    pollingIntervalRef.current = window.setInterval(fetchLatestTournaments, 10000);

    // Immediate first fetch so we don't wait 10s
    fetchLatestTournaments();

    return () => {
      if (pollingIntervalRef.current) {
        window.clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isConnected, onNewTournament]);

  return { isConnected, latestEvent, isPolling };
};
