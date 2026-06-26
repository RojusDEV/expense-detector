package com.expensedetector.backend.repository;

import com.expensedetector.backend.model.DTO.MatchResult;
import com.expensedetector.backend.model.entity.Merchant;
import com.expensedetector.backend.model.entity.Subscriptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, UUID> {
    @Query(value = """
            SELECT m.* FROM merchant m
            JOIN merchant_aliases a ON a.merchant_id = m.id
            WHERE a.raw_name = :name
              AND (m.user_id = :userId OR m.user_id IS NULL)
            LIMIT 1
            """, nativeQuery = true)
    Optional<Merchant> findByAlias(@Param("name") String name, @Param("userId") UUID userId);

    @Query(value = """
            SELECT m.id AS "merchantId", similarity(:name, m.name) AS score
            FROM merchant m
            WHERE (m.user_id = :userId OR m.user_id IS NULL)
              AND :name % ANY(STRING_TO_ARRAY(m.name, ' '))
            ORDER BY (m.user_id IS NULL) ASC, score DESC
            LIMIT 1
            """, nativeQuery = true)
    Optional<MatchResult> findMatching(@Param("name") String name, @Param("userId") UUID userId);

    Optional<List<Merchant>> findByUserId(UUID userId);
}