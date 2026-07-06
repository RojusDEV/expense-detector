package com.expensedetector.backend.util;

import java.math.BigDecimal;
import java.util.List;

public class MathUtil<T extends Number> {

    public double mean(List<T> arr, int n) {
        double sum = 0;

        for (int i = 0; i < n; i++) {
            sum += arr.get(i).doubleValue();
        }
        return sum / n;
    }

    public double standardDeviation(List<T> arr, int n) {
        double sum = 0;
        double mean = mean(arr, n);

        for (int i = 0; i < n; i++)
            sum += (arr.get(i).doubleValue() - mean) *
                    (arr.get(i).doubleValue() - mean);

        return Math.sqrt(sum / (n - 1));
    }

    public double calculatePercentageOverageFromZ(double zScore, double std, double mean) {
        if (mean == 0) {
            return 0.0;
        }
        double diff = zScore * std;
        return (diff / mean) * 100;
    }

    public double zscore(BigDecimal x, double mean, double stdDev) {
        double value = x.doubleValue();
        if (stdDev == 0) {
            return value == mean ? 0 : Double.POSITIVE_INFINITY;
        }
        return (value - mean) / stdDev;
    }

    public double coefficientOfVariation(List<T> arr, int n) {
        return (standardDeviation(arr, n) / mean(arr, n));
    }
}