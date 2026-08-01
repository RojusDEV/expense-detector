package com.expensedetector.backend.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LatestTransactionsDto {
    UUID id;
    LocalDate transactionDate;
    String merchantName;
    String categoryName;
    BigDecimal amount;
    Boolean isExpense;
}