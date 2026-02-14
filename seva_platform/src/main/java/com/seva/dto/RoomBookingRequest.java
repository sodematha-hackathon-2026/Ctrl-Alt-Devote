package com.seva.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RoomBookingRequest {
    @jakarta.validation.constraints.NotNull(message = "Check-in date is required")
    @jakarta.validation.constraints.FutureOrPresent(message = "Check-in date must be today or in the future")
    private LocalDate checkInDate;

    @jakarta.validation.constraints.NotNull(message = "Check-out date is required")
    @jakarta.validation.constraints.Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;

    @jakarta.validation.constraints.Min(value = 1, message = "At least one guest is required")
    private Integer numberOfGuests;

    @jakarta.validation.constraints.Min(value = 1, message = "At least one room is required")
    private Integer numberOfRooms;

    private Boolean consentDataStorage;
}
