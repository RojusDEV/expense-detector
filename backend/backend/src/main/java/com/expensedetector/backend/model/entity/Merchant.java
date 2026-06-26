package com.expensedetector.backend.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Entity
@Table(name = "merchant")
@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @NotBlank
    @Size(max = 255)
    private String name;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "category_id")
    private Integer categoryId;

    public Merchant(String name, UUID userId) {
        this.name = name;
        this.userId = userId;
    }

    public Merchant(String name, UUID userId, Integer categoryId) {
        this.name = name;
        this.userId = userId;
        this.categoryId = categoryId;
    }
}