package com.seva.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "timings")
@Data
public class Timings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location; // e.g., "Sode", "Udupi"
    private String darshanTime;
    private String prasadaTime;
    private Boolean isActive;
}
