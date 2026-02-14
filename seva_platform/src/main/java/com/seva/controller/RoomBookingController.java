package com.seva.controller;

import com.seva.entity.RoomBooking;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class RoomBookingController {

    private final com.seva.service.BookingService bookingService;

    @PostMapping
    public ResponseEntity<Map<String, String>> createBooking(@RequestBody com.seva.dto.RoomBookingRequest request,
            Authentication authentication) {

        String phoneNumber = null;
        if (authentication != null) {
            phoneNumber = authentication.getName();
        }

        if (phoneNumber == null) {
            return ResponseEntity.status(401).body(Map.of("message", "User not authenticated"));
        }

        RoomBooking savedBooking = bookingService.bookRoom(request, phoneNumber);

        Map<String, String> response = new HashMap<>();
        response.put("referenceId", savedBooking.getId().toString());
        response.put("message", "Booking request submitted successfully.");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<java.util.List<com.seva.dto.RoomBookingResponse>> getAllRoomBookings() {
        return ResponseEntity.ok(bookingService.getAllRoomBookings());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Map<String, String>> approveBooking(@PathVariable String id) {
        try {
            bookingService.updateBookingStatus(id, "APPROVED");
            return ResponseEntity.ok(Map.of("message", "Booking approved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to approve booking: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Map<String, String>> rejectBooking(@PathVariable String id) {
        try {
            bookingService.updateBookingStatus(id, "REJECTED");
            return ResponseEntity.ok(Map.of("message", "Booking rejected successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to reject booking: " + e.getMessage()));
        }
    }
}
