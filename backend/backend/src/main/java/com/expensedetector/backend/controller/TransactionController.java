package com.expensedetector.backend.controller;

import com.expensedetector.backend.model.DTO.TransactionDTO;
import com.expensedetector.backend.model.entity.Transaction;
import com.expensedetector.backend.payload.response.TransactionsResponse;
import com.expensedetector.backend.repository.TransactionsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionsRepository transactionsRepository;

    @Autowired
    public TransactionController(TransactionsRepository transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    @GetMapping
    public ResponseEntity<TransactionsResponse> getTransactions(@RequestParam(required = false) Integer pageParam, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<Transaction> transactions = pageParam != null
                ? transactionsRepository.findByUserId(userId, PageRequest.of(pageParam, 10))
                : transactionsRepository.findByUserId(userId);

        List<TransactionDTO> dtos = transactions.stream()
                .map(this::toDto)
                .toList();

        return ResponseEntity.ok(new TransactionsResponse(dtos));
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
