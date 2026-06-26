package com.expensedetector.backend.repository;

import com.expensedetector.backend.model.entity.Transaction;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionsRepository extends JpaRepository<Transaction, UUID> {
    Boolean existsByUserIdAndTransactionDateAndAmountAndRawDescription(UUID userId, LocalDate transactionDate, BigDecimal amount, String rawDescription);
    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.category LEFT JOIN FETCH t.merchant WHERE t.userId = :userId")
    List<Transaction> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.category LEFT JOIN FETCH t.merchant WHERE t.userId = :userId")
    List<Transaction> findByUserId(@Param("userId") UUID userId,
                                   PageRequest pageable);
}