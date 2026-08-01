package com.expensedetector.backend.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategorySummaryDTO {
    Integer categoryId;
    String categoryName;
    BigDecimal totalAmount;
}