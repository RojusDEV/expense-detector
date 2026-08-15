package com.expensedetector.backend.service;

import com.expensedetector.backend.model.entity.Category;
import com.expensedetector.backend.model.entity.CategoryKeywords;
import com.expensedetector.backend.repository.CategoryKeywordsRepository;
import com.expensedetector.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    private final CategoryKeywordsRepository categoryKeywordsRepository;
    private final CategoryRepository categoryRepository;

    private volatile Map<String, Integer> keywordToCategoryId;
    private volatile Map<Integer, Category> categoriesById;

    @Autowired
    public CategoryService(CategoryKeywordsRepository categoryKeywordsRepository, CategoryRepository categoryRepository) {
        this.categoryKeywordsRepository = categoryKeywordsRepository;
        this.categoryRepository = categoryRepository;

    }


    private void ensureLoaded() {
        if (keywordToCategoryId != null) return;
        synchronized (this) {
            if (keywordToCategoryId != null) return;
            categoriesById = categoryRepository.findAll().stream()
                    .collect(Collectors.toMap(Category::getId, c -> c));
            keywordToCategoryId = categoryKeywordsRepository.findAll().stream()
                    .collect(Collectors.toMap(CategoryKeywords::getKeyword,
                            CategoryKeywords::getCategory_id, (a, b) -> a));
        }
    }

    public Optional<Category> findByKeywords(String merchantName, String description) {
        ensureLoaded();
        String[] words = (merchantName + " " + description)
                .toLowerCase()
                .replaceAll("[^a-z ]", "")
                .replaceAll(" +", " ")
                .trim()
                .split(" ");

        for (String word : words) {
            Integer categoryId = keywordToCategoryId.get(word);
            if (categoryId != null) return Optional.ofNullable(categoriesById.get(categoryId));
        }
        return Optional.empty();
    }

    public void invalidateCache() {
        keywordToCategoryId = null;
        categoriesById = null;
    }
}
