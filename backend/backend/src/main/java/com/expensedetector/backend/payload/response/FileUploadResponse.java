package com.expensedetector.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileUploadResponse {
    String message;
    Integer importCount;
    Integer duplicated;
//    Integer merchantCount;
//    Integer subscriptions;
//    Integer anomalies;
}
