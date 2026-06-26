package com.expensedetector.backend.service;

import com.expensedetector.backend.model.entity.Category;
import com.expensedetector.backend.model.entity.CategoryKeywords;
import com.expensedetector.backend.repository.CategoryKeywordsRepository;
import com.expensedetector.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class CategoryService {

    private final CategoryKeywordsRepository categoryKeywordsRepository;
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryKeywordsRepository categoryKeywordsRepository,
                           CategoryRepository categoryRepository) {
        this.categoryKeywordsRepository = categoryKeywordsRepository;
        this.categoryRepository = categoryRepository;
    }

    public Optional<Category> findByKeywords(String merchantName, String description) throws IOException {
        String[] words = (merchantName + " " + description)
                .toLowerCase()
                .replaceAll("[^a-z ]", "")
                .replaceAll(" +", " ")
                .trim()
                .split(" ");

        Set<String> wordSet = new HashSet<>(List.of(words));

        for (String word : wordSet) {
            Optional<CategoryKeywords> keyword = categoryKeywordsRepository.findFirstByKeyword(word);
            if (keyword.isPresent()) {
                return categoryRepository.findById(keyword.get().getCategory_id());
            }
        }
        return Optional.empty();
    }
}
