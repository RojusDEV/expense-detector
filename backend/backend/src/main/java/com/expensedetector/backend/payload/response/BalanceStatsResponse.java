package com.expensedetector.backend.payload.response;

import com.expensedetector.backend.model.DTO.BalanceStatsDTO;
import lombok.Data;

@Data
public class BalanceStatsResponse {
    private BalanceStatsDTO balanceStatsDTO;

    public BalanceStatsResponse(BalanceStatsDTO balanceStatsDTO) {
        this.balanceStatsDTO = balanceStatsDTO;
    }
}
