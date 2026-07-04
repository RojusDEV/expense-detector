package com.expensedetector.backend.service;

import com.expensedetector.backend.model.DTO.MatchResult;
import com.expensedetector.backend.model.entity.Merchant;
import com.expensedetector.backend.repository.MerchantRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MerchantServiceTest {
    @Mock
    private MerchantRepository merchantRepository;

    @InjectMocks
    private MerchantService merchantService;

    @Test
    void testIfNewMerchantGetsCreated() {
        String name = "maxima";
        UUID userId = UUID.fromString("fb92795c-7d91-49b6-8977-f2a893c52fb0");
        Merchant merchant = new Merchant(name, userId);


        when(merchantRepository.save(any(Merchant.class))).thenReturn(merchant);

        Merchant created = merchantService.create(name, userId);

        assertNotNull(created);
        assertEquals(name, created.getName());
        assertEquals(userId, created.getUserId());
    }


    @Test
    void find_whenAliasMatches_returnsAliasedMerchant() {
        String name = "maxima";
        UUID userId = UUID.fromString("fb92795c-7d91-49b6-8977-f2a893c52fb0");
        Merchant merchant = new Merchant(name, userId);


        when(merchantRepository.findByAlias(name, userId)).thenReturn(Optional.of(merchant));


        Optional<Merchant> result = merchantService.find(name, userId);

        assertTrue(result.isPresent());
        assertEquals(merchant, result.get());
        verify(merchantRepository, never()).findMatching(any(), any());
    }

    @Test
    void find_whenNoAliasButFuzzyMatch_returnsMatchedMerchant() {
        String name = "maxima";
        UUID userId = UUID.fromString("fb92795c-7d91-49b6-8977-f2a893c52fb0");
        UUID merchantId = UUID.fromString("cc2a3594-5544-4860-96f3-fc3e59b2d863");
        MatchResult match = new MatchResult(merchantId, 1.0);
        Merchant matchedMerchant = new Merchant("Maxima Groceries", userId);

        when(merchantRepository.findByAlias(name, userId)).thenReturn(Optional.empty());
        when(merchantRepository.findMatching(name, userId)).thenReturn(Optional.of(match));
        when(merchantRepository.getReferenceById(merchantId)).thenReturn(matchedMerchant);

        Optional<Merchant> result = merchantService.find(name, userId);


        assertTrue(result.isPresent());
        assertEquals(matchedMerchant, result.get());
    }


    @Test
    void find_whenNoAliasAndNoMatch_returnsEmpty() {
        String name = "unknown merchant";
        UUID userId = UUID.fromString("fb92795c-7d91-49b6-8977-f2a893c52fb0");

        when(merchantRepository.findByAlias(name, userId)).thenReturn(Optional.empty());
        when(merchantRepository.findMatching(name, userId)).thenReturn(Optional.empty());

        Optional<Merchant> result = merchantService.find(name, userId);

        assertTrue(result.isEmpty());
    }
}