package com.expensedetector.backend.event;

import com.expensedetector.backend.service.AnomalyService;
import com.expensedetector.backend.service.SubscriptionService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class ImportEventListener {
    private final AnomalyService anomalyService;
    private final SubscriptionService subscriptionService;

    public ImportEventListener(AnomalyService anomalyService, SubscriptionService subscriptionService) {
        this.anomalyService = anomalyService;
        this.subscriptionService = subscriptionService;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onImportCompleted(ImportCompletedEvent event) {
        anomalyService.detectAndSaveAnomalies(event.userId());
        subscriptionService.findSubscriptionsAsync(event.userId());
    }
}