package com.expensedetector.backend.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.UUID;

enum anomaly_type {
    CATEGORY_SPIKE,
    SINGLE_TRANSACTION
}

@Entity
@Table(name="anomalies")
@Data
public class Anomaly {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private UUID id;
        @NotNull
        private UUID user_id;
        @NotNull
        @Enumerated(EnumType.STRING)
        private anomaly_type anomaly_type;

        @Column(name = "category_id")
        private int categoryId;
        @Column(name = "transaction_id")
        private UUID transactionId;
        private Date month;

        private BigDecimal zscore;
        @Column(name = "expected_amount")
        private BigDecimal expectedAmount;
        @Column(name = "actual_amount")
        private BigDecimal actualAmount;
        private String explanation;
        @NotNull
        @Column(name = "is_dismissed")
        private boolean isDismissed = false;
}
