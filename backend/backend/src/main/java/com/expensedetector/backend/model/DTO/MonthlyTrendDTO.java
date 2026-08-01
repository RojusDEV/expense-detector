package com.expensedetector.backend.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyTrendDTO {
    private LocalDate month;
    private BigDecimal income;
    private BigDecimal expense;
}