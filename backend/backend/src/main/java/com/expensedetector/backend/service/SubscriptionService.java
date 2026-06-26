package com.expensedetector.backend.service;

import com.expensedetector.backend.model.entity.Merchant;
import com.expensedetector.backend.model.entity.Subscriptions;
import com.expensedetector.backend.model.entity.Transaction;
import com.expensedetector.backend.repository.SubscriptionsRepository;
import com.expensedetector.backend.repository.TransactionsRepository;
import com.expensedetector.backend.util.MathUtil;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {
    private final SubscriptionsRepository subscriptionsRepository;
    private final TransactionsRepository transactionsRepository;

    @Async
    @Transactional
    public void findSubscriptionsAsync(UUID userId) {
        findSubscriptions(transactionsRepository.findByUserId(userId));
    }

    private static final double INTERVAL_CV_THRESHOLD = 0.25;
    private static final double AMOUNT_CV_THRESHOLD = 0.2;
    private static final int MIN_TRANSACTIONS = 3;

    private final MathUtil<Number> mathUtil = new MathUtil<>();

    public SubscriptionService(SubscriptionsRepository subscriptionsRepository, TransactionsRepository transactionsRepository) {
        this.subscriptionsRepository = subscriptionsRepository;
        this.transactionsRepository = transactionsRepository;
    }

    public void findSubscriptions(List<Transaction> transactions) {
        System.out.println("Total transactions: " + transactions.size());
        long withMerchant = transactions.stream().filter(t -> t.getMerchant() != null).count();
        System.out.println("With merchant: " + withMerchant);

        if (transactions == null || transactions.isEmpty()) {
            return;
        }

        Map<Merchant, List<Transaction>> grouped = transactions.stream()
                .filter(Objects::nonNull)
                .filter(t -> t.getMerchant() != null)
                .filter(t -> t.getTransactionDate() != null)
                .filter(t -> t.getAmount() != null)
                .collect(Collectors.groupingBy(Transaction::getMerchant));

        grouped.entrySet().stream()
                .filter(entry -> entry.getValue().size() >= MIN_TRANSACTIONS)
                .filter(entry -> isSubscription(entry.getValue()))
                .forEach(entry -> {
                    Merchant merchant = entry.getKey();
                    List<Transaction> txs = new ArrayList<>(entry.getValue());
                    txs.sort(Comparator.comparing(Transaction::getTransactionDate));

                    List<Number> intervals = new ArrayList<>();
                    for (int i = 1; i < txs.size(); i++) {
                        intervals.add(ChronoUnit.DAYS.between(
                                txs.get(i - 1).getTransactionDate(),
                                txs.get(i).getTransactionDate()
                        ));
                    }

                    saveToDatabase(txs, merchant, intervals);
                });
    }

    private boolean isSubscription(List<Transaction> txs) {
        txs.sort(Comparator.comparing(Transaction::getTransactionDate));

        List<Number> intervals = new ArrayList<>();
        for (int i = 1; i < txs.size(); i++) {
            intervals.add(ChronoUnit.DAYS.between(
                    txs.get(i - 1).getTransactionDate(),
                    txs.get(i).getTransactionDate()
            ));
        }

        if (intervals.isEmpty()) return false;

        double mean = mathUtil.mean(intervals, intervals.size());
        double intervalCv = mathUtil.coefficientOfVariation(intervals, intervals.size());
        boolean regularInterval = isKnownBillingCycle(mean);

        List<Number> amounts = txs.stream()
                .map(t -> (Number) t.getAmount().doubleValue())
                .toList();
        double amountCv = mathUtil.coefficientOfVariation(amounts, amounts.size());

        return intervalCv <= INTERVAL_CV_THRESHOLD
                && amountCv <= AMOUNT_CV_THRESHOLD
                && regularInterval;
    }

    private boolean isKnownBillingCycle(double mean) {
        return (mean >= 6  && mean <= 8)
                || (mean >= 25 && mean <= 35)
                || (mean >= 55 && mean <= 65)
                || (mean >= 85 && mean <= 95);
    }

    private void saveToDatabase(List<Transaction> txs, Merchant merchant, List<Number> intervals) {
        if (txs.isEmpty() || intervals.isEmpty()) {
            return;
        }

        double avgInterval = mathUtil.mean(intervals, intervals.size());

        BigDecimal avgAmount = txs.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(txs.size()), 2, RoundingMode.HALF_UP);

        Subscriptions subscription = new Subscriptions();
        subscription.setId(UUID.randomUUID());
        subscription.setUserId(txs.getFirst().getUserId());
        subscription.setName(merchant.getName());
        subscription.setMerchant_id(merchant.getId());
        subscription.setAmount(avgAmount);
        subscription.setFrom_date(Date.from(txs.getFirst().getTransactionDate().atStartOfDay(ZoneId.systemDefault()).toInstant()));
        subscription.setFrequency_days((int) Math.round(avgInterval));
        subscription.set_active(true);

        subscriptionsRepository.save(subscription);
    }
}