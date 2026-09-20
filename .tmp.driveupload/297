package com.badminton.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@SpringBootApplication
@RestController
@RequestMapping("/fallback")
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    /**
     * Resolves client IP address for Redis-backed distributed rate limiting via Bucket4j.
     */
    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(
                exchange.getRequest().getRemoteAddress() != null
                        ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
                        : "unknown"
        );
    }

    @GetMapping("/tournaments")
    public ResponseEntity<Map<String, String>> tournamentsFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "status", "CIRCUIT_BREAKER_OPEN",
                        "message", "Tournament service is currently degraded or under heavy load. Please retry in a few seconds."
                ));
    }

    @GetMapping("/scraper")
    public ResponseEntity<Map<String, String>> scraperFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of(
                        "status", "CIRCUIT_BREAKER_OPEN",
                        "message", "Scraper ingestion service is currently unavailable."
                ));
    }
}

