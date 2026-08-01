package com.expensedetector.backend.controller;

import com.expensedetector.backend.repository.TransactionsRepository;
import com.expensedetector.backend.service.AnomalyService;
import com.expensedetector.backend.service.SubscriptionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    private final SubscriptionService subscriptionService;
    private final TransactionsRepository transactionsRepository;
    private final AnomalyService anomalyService;

    public TestController(SubscriptionService subscriptionService, TransactionsRepository transactionsRepository, AnomalyService anomalyService) {
        this.subscriptionService = subscriptionService;
        this.transactionsRepository = transactionsRepository;
        this.anomalyService = anomalyService;
    }

    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public String userAccess() {
        return "User Content.";
    }


    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin Board.";
    }


    @GetMapping("/subscriptions")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public void testSubscriptions() {
        subscriptionService.findSubscriptions(transactionsRepository.findAll());
    }


    @GetMapping("/anomaliesTest")
    public void testAnomalies(Authentication authentication)
    {
        UUID user_id = UUID.fromString(authentication.getName());
        anomalyService.detectAndSaveAnomalies(user_id);
    }
}
