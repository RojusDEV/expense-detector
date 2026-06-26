package com.expensedetector.backend.service.importer.normalizer;

import com.expensedetector.backend.model.entity.Category;
import com.expensedetector.backend.model.entity.Merchant;
import com.expensedetector.backend.model.entity.Transaction;
import com.expensedetector.backend.model.entity.Users;
import com.expensedetector.backend.service.importer.BankNormalizer;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class RevolutNormalizer implements BankNormalizer {
    @Override
    public Transaction normalizeTransaction(String[] row, Users user, Merchant merchant, Optional<Category> category) {
        throw new UnsupportedOperationException("Revolut not implemented yet");
    }

    @Override
    public String normalizeMerchantName(String raw) {
        throw new UnsupportedOperationException("Revolut not implemented yet");
    }
}