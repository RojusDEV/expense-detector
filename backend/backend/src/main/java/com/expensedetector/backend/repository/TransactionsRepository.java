package com.expensedetector.backend.repository;

import com.expensedetector.backend.model.DTO.BalanceStatsDTO;
import com.expensedetector.backend.model.DTO.CategorySumByMonthDTO;
import com.expensedetector.backend.model.DTO.LatestTransactionsDto;
import com.expensedetector.backend.model.DTO.MonthlyTrendDTO;
import com.expensedetector.backend.model.entity.CategorySummaryDTO;
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
    @Query("SELECT t.categoryId, DATE_TRUNC('month', t.transactionDate) AS month, sum(t.amount) FROM Transaction t where t.userId = :userId GROUP BY t.categoryId, DATE_TRUNC('month', t.transactionDate) order by t.categoryId, DATE_TRUNC('month', t.transactionDate)")
    List<CategorySumByMonthDTO> findByMonth(@Param("userId") UUID userId);

    @Query(value = """
    SELECT c.id AS categoryId, c.name AS categoryName, SUM(t.amount) AS totalAmount
    FROM transactions t
    LEFT JOIN category c ON c.id = t.category_id
    WHERE t.transaction_date > date_trunc('month', CURRENT_DATE) AND t.is_expense IS TRUE
      AND t.user_id = :userId
    GROUP BY c.id, c.name 
    ORDER BY c.id
    """, nativeQuery = true)
    List<CategorySummaryDTO> getMonthSummary(@Param("userId") UUID userId);


    @Query(value = """
    WITH agg AS (
        SELECT
            COALESCE(SUM(t.amount) FILTER (WHERE NOT t.is_expense), 0) AS income,
            COALESCE(SUM(t.amount) FILTER (WHERE t.is_expense), 0) AS expense
        FROM transactions t
        WHERE t.transaction_date >= date_trunc('month', CURRENT_DATE)
          AND t.user_id = :userId
    ),
    subs AS (
        SELECT
            COALESCE(SUM(s.amount), 0) AS subscriptions
        FROM subscriptions s
        WHERE s.user_id = :userId
          AND s.is_active = TRUE
    )
    SELECT
        agg.income AS income,
        agg.expense AS expense,
        subs.subscriptions AS subscriptions,
        agg.income - agg.expense - subs.subscriptions AS balance
    FROM agg, subs
    """, nativeQuery = true)
    BalanceStatsDTO getBalanceStats(@Param("userId") UUID userId);


    @Query(value = """
SELECT t.id, t.transaction_date, m.name as merchant_name, c.name as category_name, t.amount, t.is_expense FROM transactions t
         LEFT JOIN category c ON c.id = t.category_id
        LEFT JOIN merchant m ON t.merchant_id = m.id
WHERE t.user_id = :userId
ORDER BY t.transaction_date DESC LIMIT :size""", nativeQuery = true)
    List<LatestTransactionsDto> getLatestTransactions(@Param("userId") UUID userId, Integer size);



    @Query(value = """
    WITH months AS (
        SELECT generate_series(
            date_trunc('month', CURRENT_DATE - INTERVAL '5 months'),
            date_trunc('month', CURRENT_DATE),
            INTERVAL '1 month'
        )::date AS month
    ),
    monthly AS (
        SELECT
            date_trunc('month', t.transaction_date)::date AS month,
            COALESCE(SUM(t.amount) FILTER (WHERE NOT t.is_expense), 0) AS income,
            COALESCE(SUM(t.amount) FILTER (WHERE t.is_expense), 0) AS expense
        FROM transactions t
        WHERE t.user_id = :userId
          AND t.transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '5 months')
        GROUP BY date_trunc('month', t.transaction_date)
    )
    SELECT
        months.month AS month,
        COALESCE(monthly.income, 0) AS income,
        COALESCE(monthly.expense, 0) AS expense
    FROM months
    LEFT JOIN monthly ON monthly.month = months.month
    ORDER BY months.month
    """, nativeQuery = true)
    List<MonthlyTrendDTO> getMonthlyTrends(@Param("userId") UUID userId);
}