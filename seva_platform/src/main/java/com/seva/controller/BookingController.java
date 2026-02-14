package com.seva.controller;

import com.seva.entity.RoomBooking;
import com.seva.entity.Seva;
import com.seva.entity.SevaBooking;
import com.seva.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping("/room")
    public ResponseEntity<RoomBooking> bookRoom(@RequestBody com.seva.dto.RoomBookingRequest request,
            org.springframework.security.core.Authentication authentication) {
        String phoneNumber = authentication.getName();
        return ResponseEntity.ok(bookingService.bookRoom(request, phoneNumber));
    }

    @GetMapping("/sevas")
    public ResponseEntity<List<Seva>> getSevas(@RequestParam(required = false) Seva.SevaCategory category) {
        return ResponseEntity.ok(bookingService.getActiveSevas(category));
    }

    @PostMapping("/seva/initiate")
    public ResponseEntity<SevaBooking> initiateSevaBooking(@RequestBody SevaBooking booking,
            @RequestParam UUID userId) {
        return ResponseEntity.ok(bookingService.initiateSevaBooking(booking, userId));
    }

    @PostMapping("/seva/complete")
    public ResponseEntity<SevaBooking> completeSevaBooking(@RequestParam UUID bookingId,
            @RequestParam String paymentId, @RequestParam String signature) {
        return ResponseEntity.ok(bookingService.completeSevaBooking(bookingId, paymentId, signature));
    }

    @GetMapping("/seva/all")
    public ResponseEntity<List<SevaBooking>> getAllSevaBookings() {
        return ResponseEntity.ok(bookingService.getAllSevaBookings());
    }
}
