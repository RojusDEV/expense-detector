package com.expensedetector.backend.model.DTO;


import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class MerchantDTO {
    private UUID id;
    private String merchantName;
    private String categoryName;
    private List<String> merchantAliases;
}
