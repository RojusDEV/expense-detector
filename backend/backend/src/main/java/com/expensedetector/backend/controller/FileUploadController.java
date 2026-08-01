package com.expensedetector.backend.controller;

import com.expensedetector.backend.payload.response.FileUploadResponse;
import com.expensedetector.backend.service.AnomalyService;
import com.expensedetector.backend.service.SubscriptionService;
import com.expensedetector.backend.service.importer.ImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final ImportService fileService;
    @Autowired
    public FileUploadController(ImportService fileService, SubscriptionService subscriptionService, AnomalyService anomalyService) {
        this.fileService = fileService;
    }
    @PostMapping("/csv")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws IOException {
        UUID userId = UUID.fromString(authentication.getName());

        if(fileService.getUserUploadCount(userId) >= 5) {
            return ResponseEntity.status(429).body(new FileUploadResponse("Pasiektas maksimalus failų įkėlimo limitas (5).", null, null));
        }

        if (!fileService.validateCsvFormat(file)) {
            return ResponseEntity.badRequest().build();
        }

        FileUploadResponse fileUploadResponse = fileService.importFromCsv(file, userId);
        return ResponseEntity.ok(fileUploadResponse);
    }
}
