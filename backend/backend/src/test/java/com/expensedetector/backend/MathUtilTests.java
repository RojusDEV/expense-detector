package com.expensedetector.backend;

import com.expensedetector.backend.util.MathUtil;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class MathUtilTests {
    private final MathUtil<Double> mathUtil = new MathUtil<>();

    @Test
    public void meanTest() {
        List<Double> testArray = new ArrayList<>(List.of(
                201.5, 323.1, 47.9, 512.3, 88.0,
                276.4, 19.7, 403.2, 150.6, 62.8
        ));
        double actualResult = mathUtil.mean(testArray, testArray.size());
        assertEquals(208.55, actualResult, 0.001);
    }

    @Test
    public void stdDevTest() {
        List<Double> testArray = new ArrayList<>(List.of(
                201.5, 323.1, 47.9, 512.3, 88.0,
                276.4, 19.7, 403.2, 150.6, 62.8
        ));
        double actualResult = mathUtil.standardDeviation(testArray, testArray.size());
        assertEquals(166.178, actualResult, 0.001);
    }

    @Test
    void zScoreTest() {
        double actualResult = mathUtil.zscore(new BigDecimal("100.0"), 46.9833, 31.2406);
        double actualResult2 = mathUtil.zscore(new BigDecimal("50.0"),  46.9833, 31.2406);
        assertEquals(1.697, actualResult, 0.001);
        assertEquals(0.0966, actualResult2, 0.001);
    }
}
