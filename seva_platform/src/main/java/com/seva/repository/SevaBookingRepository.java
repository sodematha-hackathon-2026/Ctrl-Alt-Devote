package com.seva.repository;

import com.seva.entity.SevaBooking;
import com.seva.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SevaBookingRepository extends JpaRepository<SevaBooking, UUID> {
    List<SevaBooking> findByUser(Users user);

    List<SevaBooking> findByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    List<SevaBooking> findByPaymentStatusAndCreatedAtBetween(SevaBooking.PaymentStatus status,
            java.time.LocalDateTime start, java.time.LocalDateTime end);

    long countByPaymentStatus(SevaBooking.PaymentStatus status);
}
