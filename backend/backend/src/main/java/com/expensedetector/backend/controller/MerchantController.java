package com.expensedetector.backend.controller;


import com.expensedetector.backend.model.DTO.MerchantDTO;
import com.expensedetector.backend.model.entity.Category;
import com.expensedetector.backend.model.entity.MerchantAlias;
import com.expensedetector.backend.repository.CategoryRepository;
import com.expensedetector.backend.repository.MerchantAliasRepository;
import com.expensedetector.backend.repository.MerchantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class MerchantController {
    private final MerchantRepository merchantRepository;
    private final CategoryRepository categoryRepository;
    private final MerchantAliasRepository merchantAliasRepository;

    public MerchantController(MerchantRepository merchantRepository,
                              CategoryRepository categoryRepository,
                              MerchantAliasRepository merchantAliasRepository) {
        this.merchantRepository = merchantRepository;
        this.categoryRepository = categoryRepository;
        this.merchantAliasRepository = merchantAliasRepository;
    }

    @GetMapping("/merchants")
    public ResponseEntity<List<MerchantDTO>> getMerchants(Authentication authentication) {
        UUID user_id = UUID.fromString(authentication.getName());
        List<MerchantDTO> merchantDtos = merchantRepository.findByUserId(user_id).orElse(List.of())
                .stream()
                .map(m -> MerchantDTO.builder()
                        .id(m.getId())
                        .merchantName(m.getName())
                        .categoryName(
                                m.getCategoryId() != null
                                        ? categoryRepository.findById(m.getCategoryId())
                                        .map(Category::getName)
                                        .orElse("Uncategorized")
                                        : "Uncategorized"
                        )
                        .merchantAliases(merchantAliasRepository.findByMerchantId(m.getId())
                                .stream()
                                .map(MerchantAlias::getRawName)
                                .toList())
                        .build())
                .toList();

        return ResponseEntity.ok().body(merchantDtos);
    }
}
