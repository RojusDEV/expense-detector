package com.expensedetector.backend.repository;

import com.expensedetector.backend.model.entity.CategoryAnomalies;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryAnomaliesRepository extends JpaRepository<CategoryAnomalies, UUID> {
    List<CategoryAnomalies> findByUserId(UUID userId);
}
