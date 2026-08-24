package com.expensedetector.backend.payload.response;

import com.expensedetector.backend.model.DTO.TransactionDTO;
import lombok.Data;

import java.util.List;

@Data
public class TransactionsResponse {
    List<TransactionDTO> transactions;
    Integer transactionsCount;
    public TransactionsResponse(List<TransactionDTO> transactions, Integer transactionsCount) {
        this.transactions = transactions;
        this.transactionsCount = transactionsCount;
    }
}
