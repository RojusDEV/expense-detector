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
import java.nio.charset.StandardCharsets;
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
        if (file.isEmpty()) throw new IllegalArgumentException("File is empty");
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".csv"))
            throw new IllegalArgumentException("File must have .csv extension");

        try (CSVReader csvReader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] header = csvReader.readNext();
            if (header == null || header.length == 0)
                throw new IllegalArgumentException("CSV file is empty or has no header");
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
        String amount = t.getAmount() == null ? "" : t.getAmount().stripTrailingZeros().toPlainString();
        String date = t.getTransactionDate() == null ? "" : t.getTransactionDate().toString();
        return date + "|" + amount + "|" + normalizeRawDescription(t.getRawDescription());
    }
    @Transactional
    public FileUploadResponse importFromCsv(MultipartFile file, UUID userId) {
        try {
            Users user = userRepository.findById(userId).orElseThrow();
            BankNormalizer normalizer = normalizers.get(user.getDefault_bank().toLowerCase());
            if (normalizer == null) {
                throw new IllegalArgumentException("Unsupported bank: " + user.getDefault_bank());
            }

            List<String[]> rows = new ArrayList<>();
            Set<String> distinctMerchantNames = new HashSet<>();

            try (CSVReader csvReader = new CSVReaderBuilder(
                    new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))
                    .withSkipLines(1).build()) {

                String[] row;
                while ((row = csvReader.readNext()) != null) {
                    String merchantName = normalizer.normalizeMerchantName(row[3]);
                    if (merchantName.isEmpty()) continue;
                    distinctMerchantNames.add(merchantName);
                    rows.add(row);
                }
            }

            Map<String, Merchant> merchantsByName =
                    merchantService.findOrCreateBatch(distinctMerchantNames, userId);

            Set<UUID> merchantIds = merchantsByName.values().stream()
                    .map(Merchant::getId)
                    .collect(Collectors.toSet());
            Set<String> existingAliasKeys = aliasRepository.findByMerchantIdIn(merchantIds).stream()
                    .map(a -> a.getMerchantId() + "|" + a.getRawName())
                    .collect(Collectors.toSet());


            Set<String> existingKeys = transactionsRepository.findByUserId(userId).stream()
                    .map(this::buildDedupKey)
                    .collect(Collectors.toSet());

            Map<String, Optional<Category>> categoryCache = new HashMap<>();
            Map<UUID, Merchant> dirtyMerchants = new HashMap<>();
            List<MerchantAlias> newAliases = new ArrayList<>();
            List<Transaction> transactions = new ArrayList<>();
            Set<String> seenAliasKeys = new HashSet<>(existingAliasKeys);

            int duplicates = 0;

            for (String[] row : rows) {
                String merchantName = normalizer.normalizeMerchantName(row[3]);
                Merchant merchant = merchantsByName.get(merchantName);
                if (merchant == null) continue;

                boolean isGlobalMerchant = merchant.getUserId() == null;

                String rawCategoryHint = row[4];
                String categoryCacheKey = merchant.getName() + "|" + rawCategoryHint;
                Optional<Category> category = categoryCache.computeIfAbsent(categoryCacheKey,
                        k -> categoryService.findByKeywords(merchant.getName(), rawCategoryHint));

                Transaction t = normalizer.normalizeTransaction(row, user, merchant, category);
                t.setRawDescription(normalizeRawDescription(t.getRawDescription()));

                String key = buildDedupKey(t);
                if (!existingKeys.add(key)) {
                    duplicates++;
                    continue;
                }

                if (!isGlobalMerchant && category.isPresent()) {
                    Integer categoryId = category.get().getId();
                    if (!Objects.equals(merchant.getCategoryId(), categoryId)) {
                        merchant.setCategoryId(categoryId);
                        dirtyMerchants.put(merchant.getId(), merchant);
                    }
                }

                String aliasKey = merchant.getId() + "|" + merchantName;
                if (seenAliasKeys.add(aliasKey)) {
                    newAliases.add(new MerchantAlias(merchantName, merchant.getId(), 1.0));
                }

                transactions.add(t);
            }

            if (!dirtyMerchants.isEmpty()) merchantRepository.saveAll(dirtyMerchants.values());
            if (!newAliases.isEmpty()) aliasRepository.saveAll(newAliases);
            transactionsRepository.saveAll(transactions);

            eventPublisher.publishEvent(new ImportCompletedEvent(userId));
            return new FileUploadResponse("Uploaded successfully", transactions.size(), duplicates);

        } catch (CsvValidationException e) {
            throw new IllegalArgumentException("Invalid CSV format: " + e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}