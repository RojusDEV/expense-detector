package com.expensedetector.backend.service.importer.normalizer;

import com.expensedetector.backend.model.entity.Category;
import com.expensedetector.backend.model.entity.Merchant;
import com.expensedetector.backend.model.entity.Transaction;
import com.expensedetector.backend.model.entity.Users;
import com.expensedetector.backend.service.importer.BankNormalizer;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.sql.Time;
import java.sql.Timestamp;
import java.text.Normalizer;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class SwedbankNormalizer implements BankNormalizer {
    private String foldDiacritics(String input) {
        return Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
    }
    @Override
    public Transaction normalizeTransaction(String[] row, Users user, Merchant merchant, Optional<Category> category) {
        Transaction t = new Transaction();

        LocalDate transactionDate = LocalDate.parse(row[2], DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        t.setTransactionDate(transactionDate);
        t.setMerchantId(merchant.getId());
        t.setUserId(user.getId());
        t.setCategoryId(category.map(Category::getId).orElse(null));
        t.setRawDescription(row[4]);
        t.setRawRecipient(row[3]);
        t.setAmount(new BigDecimal(row[5].replace(',', '.')));
        t.setCurrency(row[6].toLowerCase());
        t.setRecordId(new BigDecimal(row[8]).longValue());
        t.setDescription(null);
        t.setBankSource("swedbank");
        t.setExpense(row[7].equals("D"));
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