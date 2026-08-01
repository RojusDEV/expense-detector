package com.expensedetector.backend.util;

import org.springframework.stereotype.Component;

@Component
public class Utils {

    public String capitalizeFirst(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }
}