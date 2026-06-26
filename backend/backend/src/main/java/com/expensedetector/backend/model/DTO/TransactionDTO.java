package com.expensedetector.backend.model.DTO;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class TransactionDTO {
    private UUID id;
    private BigDecimal amount;
    private LocalDate transactionDate;
    private String rawDescription;
    private String categoryName;
    private String merchantName;
    private Boolean isExpense;
}