package com.expensedetector.backend.service.importer;

import com.expensedetector.backend.event.ImportCompletedEvent;
import com.expensedetector.backend.model.entity.*;
import com.expensedetector.backend.payload.response.FileUploadResponse;
import com.expensedetector.backend.repository.MerchantAliasRepository;
import com.expensedetector.backend.repository.MerchantRepository;
import com.expensedetector.backend.repository.TransactionsRepository;
import com.expensedetector.backend.repository.UserRepository;
import com.expensedetector.backend.service.CategoryService;
import com.expensedetector.backend.service.MerchantService;
import com.expensedetector.backend.service.importer.normalizer.RevolutNormalizer;
import com.expensedetector.backend.service.importer.normalizer.SwedbankNormalizer;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ImportService {

    private final UserRepository userRepository;
    private final Map<String, BankNormalizer> normalizers;
    private final TransactionsRepository transactionsRepository;
    private final MerchantService merchantService;
    private final CategoryService categoryService;
    private final MerchantRepository merchantRepository;
    private final MerchantAliasRepository aliasRepository;
    private final ApplicationEventPublisher eventPublisher;

    public ImportService(UserRepository userRepository,
                         TransactionsRepository transactionsRepository,
                         SwedbankNormalizer swedbankNormalizer,
                         RevolutNormalizer revolutNormalizer,
                         MerchantService merchantService,
                         CategoryService categoryService,
                         MerchantRepository merchantRepository,
                         MerchantAliasRepository aliasRepository,
                         ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.transactionsRepository = transactionsRepository;
        this.merchantService = merchantService;
        this.categoryService = categoryService;
        this.normalizers = Map.of(
                "swedbank", swedbankNormalizer,
                "revolut", revolutNormalizer
        );
        this.merchantRepository = merchantRepository;
        this.aliasRepository = aliasRepository;
        this.eventPublisher = eventPublisher;
    }

    public int getUserUploadCount(UUID userId) {
        return userRepository.findById(userId)
                .map(Users::getUpload_count)
                .orElse(0);
    }

    public boolean validateCsvFormat(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".csv")) {
            throw new IllegalArgumentException("File must have .csv extension");
        }
        try (CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] header = csvReader.readNext();
            if (header == null || header.length == 0) {
                throw new IllegalArgumentException("CSV file is empty or has no header");
            }
        } catch (CsvValidationException e) {
            throw new IllegalArgumentException("Invalid CSV format: " + e.getMessage());
        }
        return true;
    }

    private String normalizeRawDescription(String raw) {
        if (raw == null) return "";
        return raw.trim().replaceAll("\\s+", " ");
    }

    private String buildDedupKey(Transaction t) {
        String amount = t.getAmount() == null
                ? ""
                : t.getAmount().stripTrailingZeros().toPlainString();
        String date = t.getTransactionDate() == null
                ? ""
                : t.getTransactionDate().toString();
        return date
                + "|" + amount
                + "|" + normalizeRawDescription(t.getRawDescription());
    }

    @Transactional
    public FileUploadResponse importFromCsv(MultipartFile file, UUID userId) {
        try {
            Users user = userRepository.findById(userId).orElseThrow();
            BankNormalizer normalizer = normalizers.get(user.getDefault_bank().toLowerCase());

            if (normalizer == null) {
                throw new IllegalArgumentException("Unsupported bank: " + user.getDefault_bank());
            }

            Set<String> existingKeys = transactionsRepository.findByUserId(userId).stream()
                    .map(this::buildDedupKey)
                    .collect(Collectors.toSet());

            try (CSVReader csvReader = new CSVReaderBuilder(
                    new InputStreamReader(file.getInputStream(), Charset.forName("ISO-8859-13")))
                    .withSkipLines(1).build()) {

                List<Transaction> transactions = new ArrayList<>();
                Set<String> seenAliasKeys = new HashSet<>();
                Map<String, Merchant> merchantCache = new HashMap<>();
                Map<String, Optional<Category>> categoryCache = new HashMap<>();

                String[] row;
                int duplicates = 0;

                while ((row = csvReader.readNext()) != null) {
                    String merchantName = normalizer.normalizeMerchantName(row[3]);
                    if (merchantName.isEmpty()) continue;

                    Merchant m = merchantCache.computeIfAbsent(merchantName,
                            name -> merchantService.findOrCreate(name, userId));
                    boolean isGlobalMerchant = m.getUserId() == null;

                    final String rawCategoryHint = row[4];
                    String categoryCacheKey = m.getName() + "|" + rawCategoryHint;
                    Optional<Category> category = categoryCache.computeIfAbsent(
                            categoryCacheKey,
                            k -> {
                                try {
                                    return categoryService.findByKeywords(m.getName(), rawCategoryHint);
                                } catch (IOException e) {
                                    throw new RuntimeException(e);
                                }
                            });
                    Transaction t = normalizer.normalizeTransaction(row, user, m, category);

                    t.setRawDescription(normalizeRawDescription(t.getRawDescription()));

                    String key = buildDedupKey(t);
                    if (!existingKeys.add(key)) {
                        duplicates++;
                        continue;
                    }

                    if (!isGlobalMerchant) {
                        category.map(Category::getId).ifPresent(m::setCategoryId);
                        merchantRepository.save(m);
                    }

                    String aliasKey = m.getId() + "|" + merchantName;
                    if (seenAliasKeys.add(aliasKey)
                            && !aliasRepository.existsByMerchantIdAndRawName(m.getId(), merchantName)) {
                        aliasRepository.save(new MerchantAlias(merchantName, m.getId(), 1.0));
                    }

                    transactions.add(t);
                }

                transactionsRepository.saveAll(transactions);
                eventPublisher.publishEvent(new ImportCompletedEvent(userId));

                return new FileUploadResponse("Uploaded successfully", transactions.size(), duplicates);
            }
        } catch (CsvValidationException e) {
            throw new IllegalArgumentException("Invalid CSV format: " + e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}