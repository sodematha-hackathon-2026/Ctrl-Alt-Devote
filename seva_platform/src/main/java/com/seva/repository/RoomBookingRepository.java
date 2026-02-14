package com.seva.repository;

import com.seva.entity.RoomBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoomBookingRepository extends JpaRepository<RoomBooking, UUID> {
    List<RoomBooking> findByUserId(String userId);
}
