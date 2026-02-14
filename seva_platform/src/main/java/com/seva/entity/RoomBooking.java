package com.seva.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "room_bookings")
@Data
public class RoomBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String userId; // Linking by ID string for flexibility

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfGuests;
    private Integer numberOfRooms;
    @Column(name = "consent")
    private boolean consentDataStorage;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String status = "PENDING"; // Simple string status
}
