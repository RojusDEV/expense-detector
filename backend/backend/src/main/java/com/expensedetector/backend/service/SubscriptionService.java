package com.expensedetector.backend.service;

import com.expensedetector.backend.model.entity.Merchant;
import com.expensedetector.backend.model.entity.Subscriptions;
import com.expensedetector.backend.model.entity.Transaction;
import com.expensedetector.backend.repository.SubscriptionsRepository;
import com.expensedetector.backend.repository.TransactionsRepository;
import com.expensedetector.backend.util.MathUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {
    private final SubscriptionsRepository subscriptionsRepository;
    private final TransactionsRepository transactionsRepository;

    private static final double INTERVAL_CV_THRESHOLD = 0.4;
    private static final double AMOUNT_CV_THRESHOLD = 0.5;
    private static final int MIN_TRANSACTIONS = 3;
    private static final double INACTIVITY_TOLERANCE = 1.75;
    private static final long MIN_SPAN_DAYS = 45;
    private static final BigDecimal MIN_AMOUNT = BigDecimal.valueOf(5.00);

    private final MathUtil<Number> mathUtil = new MathUtil<>();

    @Autowired
    public SubscriptionService(SubscriptionsRepository subscriptionsRepository, TransactionsRepository transactionsRepository) {
        this.subscriptionsRepository = subscriptionsRepository;
        this.transactionsRepository = transactionsRepository;
    }

    @Async
    @Transactional
    public void findSubscriptionsAsync(UUID userId) {
        findSubscriptions(transactionsRepository.findByUserId(userId));
    }

    public void findSubscriptions(List<Transaction> transactions) {
        if (transactions.isEmpty()) {
            return;
        }

        Map<Merchant, List<Transaction>> grouped = transactions.stream()
                .filter(Objects::nonNull)
                .filter(t -> t.getMerchant() != null)
                .filter(t -> t.getTransactionDate() != null)
                .filter(t -> t.getAmount() != null)
                .collect(Collectors.groupingBy(Transaction::getMerchant));

        grouped.forEach((merchant, txsForMerchant) -> {
            if (txsForMerchant.size() < MIN_TRANSACTIONS) {
                return;
            }

            List<Transaction> txs = new ArrayList<>(txsForMerchant);
            txs.sort(Comparator.comparing(Transaction::getTransactionDate));

            long span = ChronoUnit.DAYS.between(
                    txs.getFirst().getTransactionDate(),
                    txs.getLast().getTransactionDate()
            );
            System.out.println("===========================");
            System.out.println(span);
            System.out.println(merchant);
            System.out.println(txs.getFirst().getTransactionDate());
            System.out.println(txs.getLast().getTransactionDate());
            System.out.println("===========================");

            if (span < MIN_SPAN_DAYS) {
                return;
            }


            if (txs.getFirst().getCategory() != null
                    && txs.getFirst().getCategory().getName().equalsIgnoreCase("maistas")) {
                return;
            }

            BigDecimal latestAmount = txs.getLast().getAmount();
            if (latestAmount.compareTo(MIN_AMOUNT) < 0) {
                return;
            }

            SubscriptionStats stats = computeStats(txs);
            if (stats == null) {
                return;
            }

            if (!isSubscriptionPattern(merchant, stats)) {
                return;
            }

            boolean active = isRecentlyActive(txs, stats.avgIntervalDays);

            saveOrUpdate(txs, merchant, stats, active, latestAmount);
        });
    }

    private record SubscriptionStats(double avgIntervalDays, double intervalCv, double amountCv) {}

    private SubscriptionStats computeStats(List<Transaction> txs) {
        List<Number> intervals = new ArrayList<>();
        for (int i = 1; i < txs.size(); i++) {
            intervals.add(ChronoUnit.DAYS.between(
                    txs.get(i - 1).getTransactionDate(),
                    txs.get(i).getTransactionDate()
            ));
        }
        if (intervals.isEmpty()) return null;

        double mean = mathUtil.mean(intervals, intervals.size());
        double intervalCv = mathUtil.coefficientOfVariation(intervals, intervals.size());

        List<Number> amounts = txs.stream()
                .map(t -> (Number) t.getAmount().doubleValue())
                .toList();
        double amountCv = mathUtil.coefficientOfVariation(amounts, amounts.size());

        return new SubscriptionStats(mean, intervalCv, amountCv);
    }

    private boolean isSubscriptionPattern(Merchant merchant, SubscriptionStats stats) {
        System.out.println("Merchant: " + merchant.getName()
                + " | avgInterval: " + stats.avgIntervalDays()
                + " | intervalCV: " + stats.intervalCv()
                + " | amountCV: " + stats.amountCv());

        return stats.intervalCv() <= INTERVAL_CV_THRESHOLD
                && stats.amountCv() <= AMOUNT_CV_THRESHOLD
                && isKnownBillingCycle(stats.avgIntervalDays());
    }

    private boolean isKnownBillingCycle(double mean) {
        return (mean >= 5   && mean <= 10)   // weekly
                || (mean >= 25  && mean <= 35)   // monthly
                || (mean >= 55  && mean <= 70)   // bimonthly
                || (mean >= 80  && mean <= 100)  // quarterly
                || (mean >= 350 && mean <= 380); // annual
    }

    private boolean isRecentlyActive(List<Transaction> sortedTxs, double avgIntervalDays) {
        LocalDate lastTxDate = sortedTxs.getLast().getTransactionDate();
        long daysSinceLastTx = ChronoUnit.DAYS.between(lastTxDate, LocalDate.now());
        double toleranceDays = avgIntervalDays * INACTIVITY_TOLERANCE;
        return daysSinceLastTx <= toleranceDays;
    }

    private void saveOrUpdate(List<Transaction> txs, Merchant merchant, SubscriptionStats stats, boolean active, BigDecimal latestAmount) {
        UUID userId = txs.getFirst().getUserId();

        Optional<Subscriptions> existing = subscriptionsRepository
                .findByUserIdAndMerchantId(userId, merchant.getId());

        if (!active) return;

        Subscriptions subscription = existing.orElseGet(Subscriptions::new);
        if (existing.isEmpty()) {
            subscription.setId(UUID.randomUUID());
            subscription.setUserId(userId);
            subscription.setFrom_date(Date.from(
                    txs.getFirst().getTransactionDate().atStartOfDay(ZoneId.systemDefault()).toInstant()));
        }

        subscription.setName(merchant.getName());
        subscription.setMerchantId(merchant.getId());
        subscription.setAmount(latestAmount);  // latest price, not historical average
        subscription.setFrequency_days((int) Math.round(stats.avgIntervalDays()));
        subscription.set_active(active);

        subscriptionsRepository.save(subscription);
    }
}