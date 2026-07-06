package com.expensedetector.backend.event;

import java.util.UUID;

public record ImportCompletedEvent(UUID userId) {}