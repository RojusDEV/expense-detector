package com.expensedetector.backend.util;

import java.util.List;

public class MathUtil<T extends Number> {

    public double mean(List<T> arr, int n)
    {
        double sum = 0;

        for (int i = 0; i < n; i++) {
            sum += arr.get(i).doubleValue();
        }
        return sum / n;
    }

    public double standardDeviation(List<T> arr,
                                    int n)
    {
        double sum = 0;

        for (int i = 0; i < n; i++)
            sum = sum + (arr.get(i).doubleValue() - mean(arr, n)) *
                    (arr.get(i).doubleValue() - mean(arr, n));

        return Math.sqrt(sum / (n - 1));
    }


    public double coefficientOfVariation(List<T> arr,
                                         int n)
    {
        return (standardDeviation(arr, n) / mean(arr, n));
    }

}
