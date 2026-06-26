package com.expensedetector.backend.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
@Table(name = "category_keywords")
public class CategoryKeywords {
    @Id
    int id;
    @NotBlank
    int category_id;
    @Max(255)
    String keyword;
}
