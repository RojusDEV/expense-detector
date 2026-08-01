package com.expensedetector.backend.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BalanceStatsDTO {
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal subscriptions;
    private BigDecimal balance;
}
