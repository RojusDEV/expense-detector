package com.expensedetector.backend.service;

import com.expensedetector.backend.model.DTO.MatchResult;
import com.expensedetector.backend.model.DTO.MerchantDTO;
import com.expensedetector.backend.model.entity.Category;
import com.expensedetector.backend.model.entity.Merchant;
import com.expensedetector.backend.model.entity.MerchantAlias;
import com.expensedetector.backend.repository.CategoryRepository;
import com.expensedetector.backend.repository.MerchantAliasRepository;
import com.expensedetector.backend.repository.MerchantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MerchantService {
    private final MerchantRepository merchantRepository;
    private final CategoryRepository categoryRepository;
    private final MerchantAliasRepository merchantAliasRepository;

    @Autowired
    public MerchantService(MerchantRepository merchantRepository, CategoryRepository categoryRepository, MerchantAliasRepository merchantAliasRepository) {
        this.merchantRepository = merchantRepository;
        this.categoryRepository = categoryRepository;
        this.merchantAliasRepository = merchantAliasRepository;
    }

    @Transactional
    public Merchant findOrCreate(String normalizedName, UUID userId) {
        return find(normalizedName, userId).orElseGet(() -> create(normalizedName, userId));
    }

    public List<MerchantDTO> getMerchantsForUser(UUID user_id) {
        List<Merchant> merchants = merchantRepository.findByUserId(user_id).orElse(List.of());

        if(merchants.isEmpty()) return List.of();

        List<UUID> merchantIds = merchants.stream().map(Merchant::getId).toList();

        Map<UUID, List<String>> aliasesByMerchant = merchantAliasRepository.findByMerchantIdIn(merchantIds)
                .stream()
                .collect(Collectors.groupingBy(
                        MerchantAlias::getMerchantId,
                        Collectors.mapping(MerchantAlias::getRawName, Collectors.toList())
                ));

        List<Integer> categoryIds = merchants.stream()
                .map(Merchant::getCategoryId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        Map<Integer, String> categoryNameById = categoryRepository.findAllById(categoryIds)
                .stream()
                .collect(Collectors.toMap(Category::getId, Category::getName));

        return merchants.stream()
                .map(m -> MerchantDTO.builder()
                        .id(m.getId())
                        .merchantName(m.getName())
                        .categoryName(
                                m.getCategoryId() != null
                                        ? categoryNameById.getOrDefault(m.getCategoryId(), "Uncategorized")
                                        : "Uncategorized"
                        )
                        .merchantAliases(aliasesByMerchant.getOrDefault(m.getId(), List.of()))
                        .build())
                .toList();

    }

    @Transactional(readOnly = true)
    public Optional<Merchant> find(String normalizedName, UUID userId) {
        Optional<Merchant> hit = merchantRepository.findByAlias(normalizedName, userId);
        if (hit.isPresent()) return hit;

        Optional<MatchResult> match = merchantRepository.findMatching(normalizedName, userId);
        return match.map(m -> merchantRepository.getReferenceById(m.merchantId()));
    }

    @Transactional
    public Merchant create(String normalizedName, UUID userId) {
        Merchant newMerchant = new Merchant(normalizedName, userId);
        return merchantRepository.save(newMerchant);
    }


}