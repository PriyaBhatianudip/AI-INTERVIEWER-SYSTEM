package com.ai.interviewer.dto.admin.bulkupload;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BulkUploadErrorRow {
    private int rowNumber;
    private String reason;
}
