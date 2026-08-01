    package com.expensedetector.backend.model.entity;

    import jakarta.persistence.Column;
    import jakarta.persistence.Entity;
    import jakarta.persistence.Id;
    import jakarta.persistence.Table;
    import jakarta.validation.constraints.NotNull;
    import jakarta.validation.constraints.Size;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import org.springframework.format.annotation.DateTimeFormat;

    import java.math.BigDecimal;
    import java.util.Date;
    import java.util.UUID;

    @Entity
    @NoArgsConstructor
    @Table(name = "subscriptions")
    @Data
    public class Subscriptions {
        @Id
        private UUID id;
        @NotNull
        @Column(name = "user_id")
        private UUID userId;
        @NotNull
        @DateTimeFormat
        private Date from_date;
        @NotNull
        @Size(max = 255)
        private String name;
        @NotNull
        private BigDecimal amount;
        @Column(name = "merchant_id")
        private UUID merchantId;
        @NotNull
        private int frequency_days;

        private BigDecimal confidence;
        @NotNull
        private boolean is_active;
    }
