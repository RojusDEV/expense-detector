package com.expensedetector.backend.repository;

import com.expensedetector.backend.model.entity.Subscriptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface SubscriptionsRepository extends JpaRepository<Subscriptions, UUID> {
    // SubscriptionsRepository.java
    Optional<List<Subscriptions>> findByUserId(UUID userId);

}
