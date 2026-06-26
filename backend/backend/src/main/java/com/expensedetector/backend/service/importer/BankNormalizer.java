package com.expensedetector.backend.service.importer;

import com.expensedetector.backend.model.entity.Category;
import com.expensedetector.backend.model.entity.Merchant;
import com.expensedetector.backend.model.entity.Transaction;
import com.expensedetector.backend.model.entity.Users;

import java.util.Optional;


public interface BankNormalizer {
    Transaction normalizeTransaction(String[] row, Users user, Merchant merchant, Optional<Category> category);
    String normalizeMerchantName(String raw);
}
