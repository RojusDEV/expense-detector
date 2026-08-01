package com.expensedetector.backend.controller;

import com.expensedetector.backend.model.entity.Anomaly;
import com.expensedetector.backend.service.AnomalyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/anomalies")
public class AnomaliesController {
    private final AnomalyService anomalyService;

    public AnomaliesController(AnomalyService anomalyService) {
        this.anomalyService = anomalyService;
    }

    @GetMapping("")
    public ResponseEntity<List<Anomaly>> getAnomalies(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<Anomaly> anomalies = anomalyService.getCategoryAnomaliesFromDB(userId);
        return ResponseEntity.ok(anomalies);
    }
}
