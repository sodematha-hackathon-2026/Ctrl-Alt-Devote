package com.seva.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class RoomBookingStatusResponse {
    private UUID id;
    private String userId;
    private String userName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfGuests;
    private Integer numberOfRooms;
    private String status;
    private boolean consentDataStorage;
    private LocalDateTime createdAt;
}
