package com.expensedetector.backend.model.DTO;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@Data
@Builder
public class SubscriptionsDTO {
    private UUID id;
    private UUID user_id;
    private Date from_date;
    private String name;
    private BigDecimal amount;
    private String merchantName;
    private int frequency_days;
    private BigDecimal confidence;
    private boolean is_active;
}
