package com.seva.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class VolunteerDTO {
    private UUID userId;

    @jakarta.validation.constraints.NotBlank(message = "Name is required")
    private String name;

    @jakarta.validation.constraints.NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @jakarta.validation.constraints.Email(message = "Invalid email format")
    private String email;

    private String hobbiesOrTalents;
    private String pastExperience;
}
