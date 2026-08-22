package com.expensedetector.backend.service.importer.normalizer;

import com.expensedetector.backend.model.entity.Category;
import com.expensedetector.backend.model.entity.Merchant;
import com.expensedetector.backend.model.entity.Transaction;
import com.expensedetector.backend.model.entity.Users;
import com.expensedetector.backend.service.importer.BankNormalizer;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class SwedbankNormalizer implements BankNormalizer {
    private String foldDiacritics(String input) {
        return Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
    }

    private static final int TRANSFER_CATEGORY_ID = 4; //Pervedimai
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public Transaction normalizeTransaction(String[] row, Users user, Merchant merchant, Optional<Category> category) {
        boolean isExpense = "D".equals(row[7]);
        int categoryId = isExpense
                ? category.map(Category::getId).orElse(0) : TRANSFER_CATEGORY_ID;

        Transaction t = new Transaction();
        t.setTransactionDate(LocalDate.parse(row[2], DATE_FORMAT));
        t.setMerchantId(merchant.getId());
        t.setUserId(user.getId());
        t.setCategoryId(categoryId);
        t.setRawDescription(row[4]);
        t.setRawRecipient(row[3]);
        t.setAmount(new BigDecimal(row[5].replace(',', '.')));
        t.setCurrency(row[6].toLowerCase());
        t.setRecordId(new BigDecimal(row[8]).longValue());
        t.setDescription(null);
        t.setBankSource("swedbank");
        t.setExpense(isExpense);
        return t;
    }

    private static final Set<String> NOISE = Set.of(
            "uab", "ab", "ii", "vsi", "mb", "pc", "com",
            "ltu", "est", "lva", "lt", "ee", "lv", "lietuva",
            "pirkinys", "pirkimas", "mokejimas",
            "vilnius", "kaunas", "klaipeda", "siauliai", "panevezys", "rokiskis",
            "www"
    );

    @Override
    public String normalizeMerchantName(String raw) {
        String folded = foldDiacritics(raw.toLowerCase());
        return Arrays.stream(folded.split("[^a-z0-9]+"))
                .filter(t -> !t.isBlank())
                .filter(t -> !NOISE.contains(t))
                .filter(t -> !t.matches("\\d{3,}"))
                .collect(Collectors.joining(" "))
                .trim();
    }
}