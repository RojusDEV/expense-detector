package com.expensedetector.backend.model.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.domain.Persistable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "category_anomalies")
@Getter
@Setter
@NoArgsConstructor
public class CategoryAnomalies implements Persistable<UUID> {

    @Id
    private UUID id;

    @NotNull
    @Column(name = "user_id")
    private UUID userId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "anomaly_type", columnDefinition = "anomaly_type")
    private AnomalyType anomaly_type;

    @Column(name = "category_id")
    private int categoryId;

    private LocalDate month;

    private BigDecimal zscore;

    @Column(name = "expected_amount")
    private BigDecimal expectedAmount;

    @Column(name = "actual_amount")
    private BigDecimal actualAmount;

    private String explanation;

    @NotNull
    @Column(name = "is_dismissed")
    private boolean isDismissed = false;

    @Transient
    private boolean isNew = true;

    public CategoryAnomalies(UUID id,
                             UUID userId,
                             AnomalyType anomaly_type,
                             int categoryId,
                             LocalDate month,
                             BigDecimal zscore,
                             BigDecimal expectedAmount,
                             BigDecimal actualAmount,
                             String explanation,
                             boolean isDismissed) {
        this.id = id;
        this.userId = userId;
        this.anomaly_type = anomaly_type;
        this.categoryId = categoryId;
        this.month = month;
        this.zscore = zscore;
        this.expectedAmount = expectedAmount;
        this.actualAmount = actualAmount;
        this.explanation = explanation;
        this.isDismissed = isDismissed;
    }

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PostPersist
    @PostLoad
    void markNotNew() {
        this.isNew = false;
    }
}