package com.expensedetector.backend.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name="merchantAliases")
@Data
@AllArgsConstructor
public class MerchantAlias {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotBlank
    String rawName;
    @NotNull
    UUID merchantId;
    Double similarityScore;

    public MerchantAlias(String rawName, UUID merchantId, Double similarityScore) {
        this.rawName = rawName;
        this.merchantId = merchantId;
        this.similarityScore = similarityScore;
    }

    public MerchantAlias() {

    }
}
