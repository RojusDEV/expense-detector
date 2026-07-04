package com.expensedetector.backend.service;

import com.expensedetector.backend.model.entity.Category;
import com.expensedetector.backend.model.entity.CategoryKeywords;
import com.expensedetector.backend.repository.CategoryKeywordsRepository;
import com.expensedetector.backend.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;
@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {
    @Mock
    private CategoryKeywordsRepository categoryKeywordsRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @InjectMocks
    private CategoryService categoryService;
    @Test
    void findByKeywords_returnsCategory_whenKeywordMatches() throws IOException {
        CategoryKeywords keyword = new CategoryKeywords();
        keyword.setCategory_id(1);

        Category category = new Category();
        category.setId(1);

        lenient().when(categoryKeywordsRepository.findFirstByKeyword(anyString()))
                .thenReturn(Optional.empty());

        when(categoryKeywordsRepository.findFirstByKeyword("maxima"))
                .thenReturn(Optional.of(keyword));

        when(categoryRepository.findById(1))
                .thenReturn(Optional.of(category));

        Optional<Category> result = categoryService.findByKeywords("MAXIMA XX", "pirkinys");

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getId());
    }
}