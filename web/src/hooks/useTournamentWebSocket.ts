import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Tournament } from '../types/tournament.ts';

interface UseTournamentWebSocketResult {
  isConnected: boolean;
  latestEvent: Tournament | null;
}

export const useTournamentWebSocket = (
  onNewTournament?: (tournament: Tournament) => void
): UseTournamentWebSocketResult => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [latestEvent, setLatestEvent] = useState<Tournament | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_GATEWAY_URL || 'http://localhost:8080/ws';

    const client = new Client({
      // Use SockJS factory for network and browser compatibility
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
              setLatestEvent(tournament);
              if (onNewTournament) {
                onNewTournament(tournament);
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

  return { isConnected, latestEvent };
};

