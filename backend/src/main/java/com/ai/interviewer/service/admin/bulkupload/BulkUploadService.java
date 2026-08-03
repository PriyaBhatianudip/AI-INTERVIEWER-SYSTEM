package com.ai.interviewer.service.admin.bulkupload;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ai.interviewer.dto.admin.bulkupload.BulkUploadResponse;
import com.ai.interviewer.model.BulkUploadLog;
import com.ai.interviewer.repository.BulkUploadLogRepository;
import com.ai.interviewer.repository.QuestionRepository;
import com.ai.interviewer.repository.UserRepository;
import com.ai.interviewer.util.bulkupload.ExcelHelper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BulkUploadService 
{

    private final QuestionRepository questionRepository;
    private final BulkUploadLogRepository bulkUploadLogRepository;
    private final UserRepository userRepository;
    
    public ResponseEntity<byte[]> downloadTemplate() {
    	byte[] bytes = ExcelHelper.generateTemplate();
    	return ResponseEntity.ok()
    	        .header(HttpHeaders.CONTENT_DISPOSITION,
    	                "attachment; filename=questions_template.xlsx")
    	        .contentType(MediaType.parseMediaType(
    	                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
    	        .body(bytes);
    }

    public BulkUploadResponse upload(
            MultipartFile file,
            Long adminId            
    ) {
    	return ExcelHelper.process(
    	        file,
    	        adminId,
    	        questionRepository,
    	        bulkUploadLogRepository,
    	        userRepository   
    	);

    }

    public ResponseEntity<byte[]> downloadErrorLog(Long uploadId) {

        BulkUploadLog log = bulkUploadLogRepository.findById(uploadId)
                .orElseThrow(() -> new RuntimeException("Upload not found"));

        if (log.getErrorFilePath() == null) {
            throw new RuntimeException("No errors found for this upload");
        }

        try {
            Path path = Paths.get(log.getErrorFilePath());
            byte[] bytes = Files.readAllBytes(path);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=bulk_upload_errors_" + uploadId + ".csv")
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(bytes);

        } catch (IOException e) {
            throw new RuntimeException("Failed to download error log", e);
        }
    }

}
