package com.expensedetector.backend.model.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class LatestImportData {
    private String month;
    private Number transactionCount;
    private LocalDate latestImportDate;
}
