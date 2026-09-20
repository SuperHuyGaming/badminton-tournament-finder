package com.badminton.core.service;

import com.badminton.core.domain.OutboxEvent;
import com.badminton.core.domain.Tournament;
import com.badminton.core.repository.OutboxEventRepository;
import com.badminton.core.repository.TournamentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final GeocodingService geocodingService;
    private final ObjectMapper objectMapper;

    /**
     * Atomically saves the tournament and records an OutboxEvent within the same MongoDB transaction.
     * Mathematically eliminates the dual-write problem.
     */
    @Transactional
    public Mono<Tournament> ingestTournament(Tournament tournament) {
        // 1. Resolve coordinates to GeoJSON Point
        GeoJsonPoint coordinates = geocodingService.resolveCoordinates(
                tournament.getEventLocation(),
                tournament.getHostUniversity()
        );
        tournament.setLocation(coordinates);

        // 2. Persist tournament and create outbox event
        return tournamentRepository.save(tournament)
                .flatMap(savedTournament -> {
                    try {
                        String serializedPayload = objectMapper.writeValueAsString(savedTournament);
                        OutboxEvent event = OutboxEvent.builder()
                                .id(UUID.randomUUID().toString())
                                .aggregateType("TOURNAMENT")
                                .aggregateId(savedTournament.getId())
                                .eventType("TOURNAMENT_CREATED")
                                .payload(serializedPayload)
                                .createdAt(Instant.now())
                                .build();

                        return outboxEventRepository.save(event)
                                .thenReturn(savedTournament);
                    } catch (JsonProcessingException e) {
                        log.error("Failed to serialize tournament outbox payload: {}", e.getMessage());
                        return Mono.error(e);
                    }
                });
    }

    /**
     * Queries upcoming tournaments sorted by distance to the user's location.
     */
    public Flux<Tournament> findNearbyTournaments(double longitude, double latitude, double maxDistanceMeters) {
        Point userPoint = new Point(longitude, latitude);
        // Distance in kilometers
        Distance distance = new Distance(maxDistanceMeters / 1000.0, Metrics.KILOMETERS);
        return tournamentRepository.findByLocationNear(userPoint, distance);
    }

    /**
     * Finds all active upcoming tournaments.
     */
    public Flux<Tournament> findUpcomingTournaments(boolean openOnly) {
        Instant now = Instant.now();
        Sort sort = Sort.by(Sort.Direction.ASC, "registrationDeadline");
        if (openOnly) {
            return tournamentRepository.findByIsOpenTournamentTrueAndRegistrationDeadlineAfter(now, sort);
        }
        return tournamentRepository.findByRegistrationDeadlineAfter(now, sort);
    }

    /**
     * Optimistically increments RSVP count for a tournament.
     */
    public Mono<Tournament> rsvp(String tournamentId) {
        return tournamentRepository.findById(tournamentId)
                .flatMap(tournament -> {
                    tournament.setRsvpCount(tournament.getRsvpCount() + 1);
                    return tournamentRepository.save(tournament);
                });
    }
}

