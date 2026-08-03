package com.ai.interviewer.util.bulkupload;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import com.ai.interviewer.dto.admin.bulkupload.BulkUploadErrorRow;
import com.ai.interviewer.dto.admin.bulkupload.BulkUploadResponse;
import com.ai.interviewer.model.BulkUploadLog;
import com.ai.interviewer.model.Question;
import com.ai.interviewer.model.User;
import com.ai.interviewer.repository.BulkUploadLogRepository;
import com.ai.interviewer.repository.QuestionRepository;
import com.ai.interviewer.repository.UserRepository;

public class ExcelHelper {

    /* ================= TEMPLATE ================= */

    public static byte[] generateTemplate() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Questions");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Question Text");
            header.createCell(1).setCellValue("Job Role");
            header.createCell(2).setCellValue("Difficulty");
            header.createCell(3).setCellValue("Ideal Answer");
            header.createCell(4).setCellValue("Key Points (comma separated)");
            header.createCell(5).setCellValue("Active (TRUE/FALSE)");

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate template", e);
        }
    }

    /* ================= PROCESS UPLOAD ================= */

    public static BulkUploadResponse process(
            MultipartFile file,
            Long adminId,
            QuestionRepository questionRepository,
            BulkUploadLogRepository bulkUploadLogRepository,
            UserRepository userRepository
    ) {

        int totalRows = 0;
        int successCount = 0;
        int failureCount = 0;

        List<BulkUploadErrorRow> errorRows = new ArrayList<>();

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                totalRows++;

                try {
                    String questionText = getString(row.getCell(0));
                    String jobRole = getString(row.getCell(1));
                    String difficulty = getString(row.getCell(2));
                    String idealAnswer = getString(row.getCell(3));
                    String keyPointsRaw = getString(row.getCell(4));
                    boolean active = getBoolean(row.getCell(5));

                    if (questionText == null || questionText.isBlank()) {
                        throw new RuntimeException("Question text is empty");
                    }

                    Question question = new Question();
                    question.setQuestionText(questionText);
                    question.setJobRole(jobRole);
                    question.setDifficulty(difficulty);
                    question.setIdealAnswer(idealAnswer);
                    question.setActive(active);

                    if (keyPointsRaw != null && !keyPointsRaw.isBlank()) {
                        question.setKeyPoints(
                                Arrays.stream(keyPointsRaw.split(","))
                                        .map(String::trim)
                                        .toList()
                        );
                    }

                    questionRepository.save(question);
                    successCount++;

                } catch (Exception ex) {
                    failureCount++;
                    errorRows.add(
                            new BulkUploadErrorRow(i + 1, ex.getMessage())
                    );
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to process Excel file", e);
        }

        /* ================= SAVE UPLOAD LOG ================= */

        BulkUploadLog log = new BulkUploadLog();
        log.setUploadedBy(admin);                    // ✅ correct
        log.setFileName(file.getOriginalFilename());
        log.setTotalQuestions(totalRows);            // ✅ correct
        log.setSuccessCount(successCount);
        log.setFailureCount(failureCount);
        log.setUploadedAt(LocalDateTime.now());

        bulkUploadLogRepository.save(log);

        /* ================= RESPONSE ================= */

        return new BulkUploadResponse(
                totalRows,
                successCount,
                failureCount,
                "Bulk upload completed",
                log.getId()
        );
    }

    /* ================= HELPERS ================= */

    private static String getString(Cell cell) {
        if (cell == null) return null;
        cell.setCellType(CellType.STRING);
        return cell.getStringCellValue().trim();
    }

    private static boolean getBoolean(Cell cell) {
        if (cell == null) return true;
        if (cell.getCellType() == CellType.BOOLEAN) {
            return cell.getBooleanCellValue();
        }
        return Boolean.parseBoolean(cell.toString());
    }
}
