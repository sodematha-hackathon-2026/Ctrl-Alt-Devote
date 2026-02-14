package com.seva.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "seva_bookings")
@Data
public class SevaBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;
    @ManyToOne
    @JoinColumn(name = "seva_id")
    private Seva seva;
    private LocalDateTime sevaDate;
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    // Payment Details
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    private java.math.BigDecimal amountPaid;
    private String prasadaDeliveryMode;

    private String devoteeName;
    private String devoteeRashi;
    private String devoteeNakshatra;
    private String devoteeGothra;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    public enum BookingStatus {
        PENDING, CONFIRMED, CANCELLED, FAILED
    }

    public enum PaymentStatus {
        PENDING, PAID, FAILED, REFUNDED
    }
}