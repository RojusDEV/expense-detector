package com.expensedetector.backend.payload.response;

import com.expensedetector.backend.model.entity.CategorySummaryDTO;
import lombok.Data;

import java.util.List;

@Data
public class TransactionSummaryResponse {
    List<CategorySummaryDTO> transactionsSummary;
    public TransactionSummaryResponse(List<CategorySummaryDTO> transactionsSummary) {
        this.transactionsSummary = transactionsSummary;
    }
}
