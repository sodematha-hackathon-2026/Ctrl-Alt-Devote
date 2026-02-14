package com.seva.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "sevas")
@Data
public class Seva {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String titleEnglish;
    private String titleKannada;
    private BigDecimal amount;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private SevaCategory category;

    private Boolean isActive;

    public enum SevaCategory {
        SODE, UDUPI_PARYAYA
    }
}