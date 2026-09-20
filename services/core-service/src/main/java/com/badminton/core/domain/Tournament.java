package com.badminton.core.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tournaments")
public class Tournament {

    @Id
    private String id;

    private String tournamentName;
    private String hostUniversity;
    private String eventLocation;

    /**
     * GeoJSON Point [longitude, latitude] for geospatial querying.
     * Backed by a 2dsphere index for accurate earth-surface distance calculations.
     */
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;

    private Instant registrationDeadline;
    private Instant rideFormDeadline;
    private Boolean isOpenTournament;

    private String registrationUrl;
    private String sourceUrl;
    private String flyerImageUrl;

    @Builder.Default
    private Integer rsvpCount = 0;

    @Builder.Default
    private Instant createdAt = Instant.now();
}

