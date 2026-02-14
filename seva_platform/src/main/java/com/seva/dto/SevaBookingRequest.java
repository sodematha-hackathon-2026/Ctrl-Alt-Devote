package com.seva.dto;

import lombok.Data;
import java.util.UUID;
import java.time.LocalTime;

@Data
public class SevaBookingRequest {
    @jakarta.validation.constraints.NotNull(message = "Seva ID is required")
    private UUID sevaId;

    @jakarta.validation.constraints.NotNull(message = "Seva date/time is required")
    private LocalTime sevaDate;
}
