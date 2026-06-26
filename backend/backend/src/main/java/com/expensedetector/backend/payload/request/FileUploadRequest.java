package com.expensedetector.backend.payload.request;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@Data
public class FileUploadRequest {
    private MultipartFile file;
    private String fileName;
}
