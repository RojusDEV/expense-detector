package com.expensedetector.backend.service;

import com.expensedetector.backend.model.DTO.MatchResult;
import com.expensedetector.backend.model.entity.Merchant;
import com.expensedetector.backend.model.entity.MerchantAlias;
import com.expensedetector.backend.repository.MerchantAliasRepository;
import com.expensedetector.backend.repository.MerchantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class MerchantService {
    private final MerchantRepository merchantRepository;

    public MerchantService(MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    @Transactional
    public Merchant findOrCreate(String normalizedName, UUID userId) {
        Optional<Merchant> hit = merchantRepository.findByAlias(normalizedName, userId);
        if (hit.isPresent()) {
            return hit.get();
        }

        Optional<MatchResult> match = merchantRepository.findMatching(normalizedName, userId);
        if (match.isPresent()) {
            return merchantRepository.getReferenceById(match.get().merchantId());
        }

        Merchant newMerchant = new Merchant(normalizedName, userId);
        return merchantRepository.save(newMerchant);
    }
}