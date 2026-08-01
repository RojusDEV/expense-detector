package com.expensedetector.backend.service;

import com.expensedetector.backend.model.DTO.*;
import com.expensedetector.backend.model.entity.CategorySummaryDTO;
import com.expensedetector.backend.model.entity.Transaction;
import com.expensedetector.backend.repository.TransactionsRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransactionService {
    private final TransactionsRepository transactionsRepository;

    public TransactionService(TransactionsRepository transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    public List<TransactionDTO> getTransactions(UUID userId, Optional<Integer> pageParam) {
        List<Transaction> transactions = pageParam
                .map(page -> transactionsRepository.findByUserId(userId, PageRequest.of(page, 10)))
                .orElseGet(() -> transactionsRepository.findByUserId(userId));

        return transactions.stream()
                .map(this::toDto)
                .toList();
    }

    public List<CategorySummaryDTO> getCategorySummary(UUID userId) {
        return transactionsRepository.getMonthSummary(userId);
    }

    public List<LatestTransactionsDto> getLatestTransactions(UUID userId, Optional<Integer> size) {
        return transactionsRepository.getLatestTransactions(userId, size.orElse(6));
    }

//    public LatestImportData getLatestImportData(UUID userId) {
//        return transactionsRepository.
//    }

    public BalanceStatsDTO getBalanceStats(UUID userId) {
        return transactionsRepository.getBalanceStats(userId);
    }

    public List<MonthlyTrendDTO> getMonthlyTrends(UUID userId) {
        return transactionsRepository.getMonthlyTrends(userId);
    }

    private TransactionDTO toDto(Transaction t) {
        return TransactionDTO.builder()
                .id(t.getId())
                .isExpense(t.isExpense())
                .amount(t.getAmount())
                .transactionDate(t.getTransactionDate())
                .rawDescription(t.getRawDescription())
                .categoryName(t.getCategory() != null ? t.getCategory().getName() : null)
                .merchantName(t.getMerchant() != null ? t.getMerchant().getName() : null)
                .build();
    }
}



