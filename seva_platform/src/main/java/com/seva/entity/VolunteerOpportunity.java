package com.seva.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "volunteer_opportunities")
@Data
public class VolunteerOpportunity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    @Column(length = 2000)
    private String description;
    @Column(length = 1000)
    private String requiredSkills;
    private String imageUrl; // URL to the image icon

    // Stats
    private Integer applicationCount = 0;

    @Enumerated(EnumType.STRING)
    private Status status = Status.OPEN;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Status {
        OPEN, CLOSED
    }
}
