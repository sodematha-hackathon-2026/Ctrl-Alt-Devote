package com.seva.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    @jakarta.validation.constraints.NotBlank(message = "Phone number is required")
    private String phoneNumber;
    private String fullName;

    @jakarta.validation.constraints.Email(message = "Invalid email format")
    private String email;

    private String gothra;
    private String rashi;
    private String nakshatra;
    private String address;
    private String city;
    private String state;
    private String pincode;

    @Enumerated(EnumType.STRING)
    @jakarta.validation.constraints.NotNull(message = "Role is required")
    private Role role;
    private Boolean consentDataStorage;
    private Boolean consentCommunications;
    private String fcmToken;

    private Boolean isVolunteer = false;
    private Boolean volunteerRequest = false;
    private Boolean isAdmin = false;
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Role {
        USER, ADMIN
    }
}