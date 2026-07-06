package com.expensedetector.backend.model.DTO;


import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class CategorySumByMonthDTO {
    private Integer category_id;
    private LocalDate month;
    private BigDecimal sum;
}
