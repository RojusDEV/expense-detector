package com.expensedetector.backend.controller;

import com.expensedetector.backend.model.DTO.*;
import com.expensedetector.backend.model.entity.CategorySummaryDTO;
import com.expensedetector.backend.payload.response.*;
import com.expensedetector.backend.repository.TransactionsRepository;
import com.expensedetector.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionsRepository transactionsRepository;


    public record ApiResponse<T>(T data) {}

    @Autowired
    public TransactionController(TransactionService transactionService, TransactionsRepository transactionsRepository) {
        this.transactionService = transactionService;
        this.transactionsRepository = transactionsRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<TransactionsResponse>> getTransactions(
            @RequestParam(required = false) Optional<Integer> pageParam,
            @RequestParam(required = false, name = "search") Optional<String> searchParam,
            @RequestParam(required = false) Optional<LocalDate> fromDate,
            @RequestParam(required = false) Optional<LocalDate> toDate,
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());

        List<TransactionDTO> dtos = transactionService.getTransactions(
                userId,
                pageParam,
                searchParam,
                fromDate,
                toDate
        );

        Integer totalTransactionsCount = transactionsRepository.countFilteredTransactions(
                userId,
                searchParam.filter(s -> !s.isBlank()).orElse(null),
                fromDate.orElse(null),
                toDate.orElse(null)
        );

        TransactionsResponse body = new TransactionsResponse(dtos, totalTransactionsCount);
        return new ResponseEntity<>(new ApiResponse<>(body), HttpStatus.OK);
    }

    @GetMapping("/summary")
    public ResponseEntity<TransactionSummaryResponse> getCategorySummary(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<CategorySummaryDTO> monthlySummary = transactionService.getCategorySummary(userId);
        return ResponseEntity.ok(new TransactionSummaryResponse(monthlySummary));
    }

    @GetMapping("/latest")
    public ResponseEntity<LatestTransactionsDtoResponse> getLatestTransactions(Authentication authentication, @RequestParam(required = false) Optional<Integer> size) {
        UUID userId = UUID.fromString(authentication.getName());
        List<LatestTransactionsDto> latestTransactions = transactionService.getLatestTransactions(userId, size);
        return ResponseEntity.ok(new LatestTransactionsDtoResponse(latestTransactions));
    }

    @GetMapping("/stats")
    public ResponseEntity<BalanceStatsResponse> getBalanceStats(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        BalanceStatsDTO balanceStats = transactionService.getBalanceStats(userId);
        return ResponseEntity.ok(new BalanceStatsResponse(balanceStats));
    }


    @GetMapping("/trends")
    public ResponseEntity<MonthlyTrendsResponse> getMonthlyTrends(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<MonthlyTrendDTO> monthlyTrendDTO = transactionService.getMonthlyTrends(userId);
        return ResponseEntity.ok(new MonthlyTrendsResponse(monthlyTrendDTO));
    }
}
