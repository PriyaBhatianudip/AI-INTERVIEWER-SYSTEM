package com.ai.interviewer.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BulkUploadLog {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private User uploadedBy;

    private String fileName;
    private int totalQuestions;
    private int successCount;
    private int failureCount;

    private LocalDateTime uploadedAt;
    private String errorFilePath;

}
