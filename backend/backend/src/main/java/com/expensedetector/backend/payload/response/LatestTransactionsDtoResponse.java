package com.expensedetector.backend.payload.response;

import com.expensedetector.backend.model.DTO.LatestTransactionsDto;
import lombok.Data;

import java.util.List;

@Data
public class LatestTransactionsDtoResponse {
    private List<LatestTransactionsDto> latestTransactions;

    public LatestTransactionsDtoResponse(List<LatestTransactionsDto> latestTransactions) {
        this.latestTransactions = latestTransactions;
    }
}
