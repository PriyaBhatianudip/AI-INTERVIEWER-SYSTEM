package com.ai.interviewer.dto.admin.bulkupload;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BulkUploadResponse {

    private int totalRows;
    private int successCount;
    private int failureCount;
    private String message;
    private Long uploadId;
}
