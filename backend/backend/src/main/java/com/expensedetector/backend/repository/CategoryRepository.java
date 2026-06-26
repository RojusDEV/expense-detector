package com.expensedetector.backend.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.expensedetector.backend.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    Remapper findCategoryById(Integer id);
}
