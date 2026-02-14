package com.seva.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "flash_updates")
@Data
public class FlashUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
    private String link;
    private Boolean isActive;
    private LocalDate expiryDate;
}
