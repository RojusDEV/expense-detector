package com.expensedetector.backend.repository;

import com.expensedetector.backend.model.entity.MerchantAlias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MerchantAliasRepository extends JpaRepository<MerchantAlias, UUID> {
    List<MerchantAlias> findByMerchantId(UUID merchantId);
    boolean existsByMerchantIdAndRawName(UUID merchantId, String rawName);
}