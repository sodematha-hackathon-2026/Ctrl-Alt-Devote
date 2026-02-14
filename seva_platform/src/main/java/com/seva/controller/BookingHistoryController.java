package com.seva.controller;

import com.seva.dto.BookingHistoryResponse;
import com.seva.dto.SevaHistoryResponse;
import com.seva.dto.RoomBookingStatusResponse;
import com.seva.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingHistoryController {
    
    private final BookingService bookingService;

    @GetMapping("/history")
    public ResponseEntity<BookingHistoryResponse> getUserBookingHistory(Authentication authentication) {
        String phoneNumber = authentication.getName();
        BookingHistoryResponse history = bookingService.getUserBookingHistory(phoneNumber);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/seva/user/{userId}")
    public ResponseEntity<List<SevaHistoryResponse>> getUserSevaBookings(@PathVariable String userId, Authentication authentication) {
        String phoneNumber = authentication.getName();
        BookingHistoryResponse history = bookingService.getUserBookingHistory(phoneNumber);
        return ResponseEntity.ok(history.getSevaHistory());
    }

    @GetMapping("/room/user/{userId}")
    public ResponseEntity<List<RoomBookingStatusResponse>> getUserRoomBookings(@PathVariable String userId, Authentication authentication) {
        String phoneNumber = authentication.getName();
        BookingHistoryResponse history = bookingService.getUserBookingHistory(phoneNumber);
        return ResponseEntity.ok(history.getRoomBookings());
    }
}
