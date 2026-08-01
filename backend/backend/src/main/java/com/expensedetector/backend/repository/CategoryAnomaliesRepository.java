package com.expensedetector.backend.repository;

import com.expensedetector.backend.model.entity.Anomaly;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryAnomaliesRepository extends JpaRepository<Anomaly, UUID> {
    List<Anomaly> findByUserId(UUID userId);
}
