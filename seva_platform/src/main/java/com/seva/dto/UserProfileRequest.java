package com.seva.dto;

import lombok.Data;

@Data
public class UserProfileRequest {
    @jakarta.validation.constraints.NotBlank(message = "Name is required")
    private String name;

    @jakarta.validation.constraints.NotBlank(message = "Phone number is required")
    private String phone;

    @jakarta.validation.constraints.Email(message = "Invalid email format")
    private String email;

    private String address;
    private Boolean consentDataStorage;
    private Boolean consentCommunication;
    private String fcmToken;
    private Boolean isVolunteer;
    private Boolean volunteerRequest;
}
