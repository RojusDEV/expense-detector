package com.expensedetector.backend.repository;

import com.expensedetector.backend.model.entity.CategoryKeywords;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryKeywordsRepository extends JpaRepository<CategoryKeywords, Integer> {
    Optional<CategoryKeywords> findFirstByKeyword(String keyword);
}
