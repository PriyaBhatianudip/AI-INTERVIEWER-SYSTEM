package com.ai.interviewer.controller.admin.bulkupload;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ai.interviewer.dto.admin.bulkupload.BulkUploadResponse;
import com.ai.interviewer.service.admin.bulkupload.BulkUploadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/bulk-upload")
@RequiredArgsConstructor
public class BulkUploadController {

    private final BulkUploadService bulkUploadService;

    // 📥 Download sample Excel

    @GetMapping("/template")
    public ResponseEntity<byte[]> downloadTemplate() {
        return bulkUploadService.downloadTemplate();
    }

    // ⬆ Upload Excel file
    @PostMapping
    public ResponseEntity<BulkUploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam Long adminId
    ) {
        return ResponseEntity.ok(
                bulkUploadService.upload(file, adminId)
        );
    }

    // 📄 Download error log
    @GetMapping("/{uploadId}/errors")
    public ResponseEntity<byte[]> downloadErrors(
            @PathVariable Long uploadId
    ) {
        return bulkUploadService.downloadErrorLog(uploadId);
    }
}
