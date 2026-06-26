package com.expensedetector.backend.controller;

import com.expensedetector.backend.model.DTO.SubscriptionsDTO;
import com.expensedetector.backend.model.entity.Merchant;
import com.expensedetector.backend.repository.MerchantRepository;
import com.expensedetector.backend.repository.SubscriptionsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class SubscriptionController {
    private final SubscriptionsRepository subscriptionsRepository;
    private final MerchantRepository merchantRepository;

    public SubscriptionController(SubscriptionsRepository subscriptionsRepository, MerchantRepository merchantRepository) {
        this.subscriptionsRepository = subscriptionsRepository;
        this.merchantRepository = merchantRepository;
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<List<SubscriptionsDTO>> getSubscriptions(Authentication authentication) {
        UUID user_id = UUID.fromString(authentication.getName());

        List<SubscriptionsDTO> dtos = subscriptionsRepository.findByUserId(user_id)
                .orElse(List.of())
                .stream()
                .map(s -> SubscriptionsDTO.builder()
                        .id(s.getId())
                        .user_id(s.getUserId())
                        .from_date(s.getFrom_date())
                        .name(s.getName())
                        .amount(s.getAmount())
                        .merchantName(merchantRepository.findById(s.getMerchant_id())
                                .map(Merchant::getName)
                                .orElse(null))
                        .frequency_days(s.getFrequency_days())
                        .confidence(s.getConfidence())
                        .is_active(s.is_active())
                        .build())
                .toList();

        return ResponseEntity.ok().body(dtos);
    }
}
