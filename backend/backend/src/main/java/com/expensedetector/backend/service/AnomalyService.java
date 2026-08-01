package com.expensedetector.backend.service;

import com.expensedetector.backend.model.DTO.CategorySumByMonthDTO;
import com.expensedetector.backend.model.entity.*;
import com.expensedetector.backend.repository.AnomalyRepository;
import com.expensedetector.backend.repository.CategoryRepository;
import com.expensedetector.backend.repository.TransactionsRepository;
import com.expensedetector.backend.util.MathUtil;
import com.expensedetector.backend.util.Utils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class AnomalyService {

    private static final Map<Month, String> MONTH_GENITIVE = Map.ofEntries(
            Map.entry(Month.JANUARY, "sausio"),
            Map.entry(Month.FEBRUARY, "vasario"),
            Map.entry(Month.MARCH, "kovo"),
            Map.entry(Month.APRIL, "balandžio"),
            Map.entry(Month.MAY, "gegužės"),
            Map.entry(Month.JUNE, "birželio"),
            Map.entry(Month.JULY, "liepos"),
            Map.entry(Month.AUGUST, "rugpjūčio"),
            Map.entry(Month.SEPTEMBER, "rugsėjo"),
            Map.entry(Month.OCTOBER, "spalio"),
            Map.entry(Month.NOVEMBER, "lapkričio"),
            Map.entry(Month.DECEMBER, "gruodžio")
    );


    private static final Map<Integer, String> CATEGORY_GENITIVE = Map.ofEntries(
            Map.entry(1, "maisto"),
            Map.entry(2, "būsto"),
            Map.entry(3, "transporto"),
            Map.entry(4, "pervedimų"),
            Map.entry(5, "pramogų"),
            Map.entry(6, "sveikatos"),
            Map.entry(7, "investavimo"),
            Map.entry(8, "kitų išlaidų"),
            Map.entry(9, "išsilavinimo"),
            Map.entry(10, "kelionių"),
            Map.entry(11, "draudimo"),
            Map.entry(12, "apsipirkimo"),
            Map.entry(0, "nežinomos kategorijos")
    );

    private static final String UNKNOWN_CATEGORY_GENITIVE = "nežinomos kategorijos";

    //Implement anomaly finder by category
    public static final int MONTHS_WINDOW = 6;

    TransactionsRepository transactionsRepository;
    AnomalyRepository anomalyRepository;
    CategoryRepository categoryRepository;

    Utils utils;
    private final MathUtil<BigDecimal> mathUtil = new MathUtil<>();

    public AnomalyService(TransactionsRepository transactionsRepository, AnomalyRepository anomalyRepository, CategoryRepository categoryRepository, Utils utils) {
        this.transactionsRepository = transactionsRepository;
        this.anomalyRepository = anomalyRepository;
        this.categoryRepository = categoryRepository;
        this.utils = utils;
    }

    public List<Anomaly> getCategoryAnomaliesFromDB(UUID userId) {
        return anomalyRepository.findByUserId(userId);
    }

    public List<Anomaly> findAnomaliesByCategory(UUID userId) throws IllegalArgumentException {
        List<CategorySumByMonthDTO> categoryDtos = transactionsRepository.findByMonth(userId);
        if(categoryDtos.isEmpty()) throw new IllegalArgumentException("Wrong type argument");

        HashMap<Integer, Map<LocalDate, BigDecimal>> categoryMonthlyTotals = new HashMap<>();

        for(CategorySumByMonthDTO i : categoryDtos) {
            categoryMonthlyTotals.computeIfAbsent(i.getCategory_id(),
                    k -> new HashMap<>()).put(i.getMonth(), i.getSum());
        }

        Map<Integer, String> categoryNames = categoryRepository.findAllById(categoryMonthlyTotals.keySet())
                .stream()
                .collect(Collectors.toMap(Category::getId, Category::getName));

        //For 6 months window compute average nth category amount spent that month and find spike
        List<Anomaly> foundAnomalies = new ArrayList<>();
        for (Map.Entry<Integer, Map<LocalDate, BigDecimal>> category : categoryMonthlyTotals.entrySet()) {

            String categoryName = categoryNames.getOrDefault(category.getKey(), "Nežinoma kategorija");

            List<LocalDate> sortedMonths = new ArrayList<>(category.getValue().keySet());
            Collections.sort(sortedMonths);

            List<BigDecimal> amounts = new ArrayList<>();

            for (LocalDate sortedMonth : sortedMonths) {

                amounts.add(category.getValue().get(sortedMonth));
                if (amounts.size() > MONTHS_WINDOW) amounts.removeFirst();
                if (amounts.size() == MONTHS_WINDOW) {
                    List<BigDecimal> subList = amounts.subList(0, amounts.size() - 1);
                    double mean = mathUtil.mean(subList, subList.size());
                    double stdDev = mathUtil.standardDeviation(subList, subList.size());
                    double zScore = mathUtil.zscore(amounts.getLast(), mean, stdDev);

                    if (!Double.isNaN(zScore) && zScore > 2) {
                        UUID randomUuid = UUID.randomUUID();
                        String monthName = MONTH_GENITIVE.get(sortedMonth.getMonth());

                        double overagePercent = mathUtil.calculatePercentageOverageFromZ(zScore, stdDev, mean);

                        String categoryGenitive = getCategoryGenitive(category.getKey(), categoryName);

                        String explanation = String.format(
                                "%s išlaidos %s mėnesį viršijo %d mėnesių vidurkį (+%.0f%%)",
                                utils.capitalizeFirst(categoryGenitive), monthName, MONTHS_WINDOW, overagePercent
                        );
                        Anomaly foundCategoryAnomaly = new Anomaly(
                                randomUuid,
                                userId,
                                AnomalyType.CATEGORY_SPIKE,
                                category.getKey(),
                                sortedMonth,
                                BigDecimal.valueOf(zScore),
                                BigDecimal.valueOf(mean),
                                amounts.getLast(),
                                explanation,
                                false,
                                AnomalyClass.CATEGORY);
                        foundAnomalies.add(foundCategoryAnomaly);
                    }
                }
            }
        }
        return foundAnomalies;
    }


    private String getCategoryGenitive(Integer categoryId, String categoryName) {
        if(categoryId == null) return UNKNOWN_CATEGORY_GENITIVE;

        return CATEGORY_GENITIVE.getOrDefault(categoryId,
                categoryName != null && !categoryName.isBlank() ? categoryName : UNKNOWN_CATEGORY_GENITIVE);
    }


    @Async("asyncTaskExecutor")
    public void detectAndSaveAnomalies(UUID userId) {
        try {
            List<Anomaly> anomalies = findAnomaliesByCategory(userId); //issue
            System.out.println("Found " + anomalies.size() + " anomalies for " + userId);
            saveAnomaliesToDB(anomalies, userId);
        } catch (IllegalArgumentException e) {
            System.out.println("No data to analyze: " + e.getMessage());
        }
    }


    public void saveAnomaliesToDB(List<Anomaly> anomalies, UUID userId) {
        Objects.requireNonNull(userId, "userId must not be null");
        if(anomalies == null || anomalies.isEmpty()) {
            //Implement Logging
            System.out.print("userId must not be null");
            return;
        }
        boolean mismatch = anomalies.stream().anyMatch(a -> !userId.equals(a.getUserId()));

        if(mismatch) {
            throw new IllegalArgumentException("Anomaly list contains entries for a different user");
        }

        anomalyRepository.saveAll(anomalies);
    }
    //Implement anomaly finder by transactions
}
