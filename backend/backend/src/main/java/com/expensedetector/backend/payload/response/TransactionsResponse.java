package com.expensedetector.backend.payload.response;

import com.expensedetector.backend.model.DTO.TransactionDTO;
import com.expensedetector.backend.model.entity.Transaction;
import lombok.Data;

import java.util.List;

@Data
public class TransactionsResponse {
    List<TransactionDTO> transactions;

    public TransactionsResponse(List<TransactionDTO> transactions) {
        this.transactions = transactions;
    }
}
