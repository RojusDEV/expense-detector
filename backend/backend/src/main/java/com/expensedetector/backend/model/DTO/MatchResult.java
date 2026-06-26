package com.expensedetector.backend.model.DTO;
import java.util.UUID;

public record MatchResult(UUID merchantId, double score) {}