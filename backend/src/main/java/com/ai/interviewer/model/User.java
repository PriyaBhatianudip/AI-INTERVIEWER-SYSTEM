package com.ai.interviewer.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(unique=true, nullable =false)
    private String email;

    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType role; // CANDIDATE / ADMIN
    
    private String status;
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
