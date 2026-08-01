package com.expensedetector.backend.payload.response;

import com.expensedetector.backend.model.DTO.MonthlyTrendDTO;
import lombok.Data;

import java.util.List;
@Data
public class MonthlyTrendsResponse {
    private List<MonthlyTrendDTO> monthlyTrends;
    public MonthlyTrendsResponse(List<MonthlyTrendDTO> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }
}
