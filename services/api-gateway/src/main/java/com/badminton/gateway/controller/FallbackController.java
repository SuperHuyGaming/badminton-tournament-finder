package com.badminton.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/tournaments")
    public Mono<ResponseEntity<Map<String, Object>>> tournamentsFallback() {
        Map<String, Object> fallbackResponse = new HashMap<>();
        fallbackResponse.put("data", Collections.emptyList());
        fallbackResponse.put("nextCursor", null);
        fallbackResponse.put("status", "DEGRADED");
        fallbackResponse.put("message", "Core service is currently unavailable. Returning cached/empty fallback.");

        // We return 200 OK with a DEGRADED flag so the frontend doesn't crash but shows no data
        return Mono.just(ResponseEntity.status(HttpStatus.OK).body(fallbackResponse));
    }

    @GetMapping("/scraper")
    public Mono<ResponseEntity<Map<String, Object>>> scraperFallback() {
        Map<String, Object> fallbackResponse = new HashMap<>();
        fallbackResponse.put("status", "DEGRADED");
        fallbackResponse.put("message", "Scraper service is currently under high load or unavailable. Please try again later.");

        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(fallbackResponse));
    }
}
