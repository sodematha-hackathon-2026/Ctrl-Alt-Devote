package com.seva.service;

import com.seva.entity.*;
import com.seva.repository.*;
import com.seva.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final RoomBookingRepository roomBookingRepository;
    private final SevaBookingRepository sevaBookingRepository;
    private final SevaRepository sevaRepository;
    private final UsersRepository usersRepository;
    private final PaymentService paymentService;
    private final EmailService emailService;

    // Room Booking
    public List<com.seva.dto.RoomBookingResponse> getAllRoomBookings() {
        List<RoomBooking> bookings = roomBookingRepository.findAll();
        return bookings.stream().map(booking -> {
            com.seva.dto.RoomBookingResponse response = new com.seva.dto.RoomBookingResponse();
            response.setId(booking.getId());
            response.setUserId(booking.getUserId());
            response.setCheckInDate(booking.getCheckInDate());
            response.setCheckOutDate(booking.getCheckOutDate());
            response.setNumberOfGuests(booking.getNumberOfGuests());
            response.setNumberOfRooms(booking.getNumberOfRooms());
            response.setStatus(booking.getStatus());

            // Get user name
            usersRepository.findByPhoneNumber(booking.getUserId()).ifPresent(user -> {
                response.setUserName(user.getFullName());
            });

            return response;
        }).collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public RoomBooking bookRoom(com.seva.dto.RoomBookingRequest request, String phoneNumber) {
        RoomBooking booking = new RoomBooking();
        booking.setUserId(phoneNumber); // Storing phone number as userId for now based on controller usage
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setNumberOfGuests(request.getNumberOfGuests());
        booking.setNumberOfRooms(request.getNumberOfRooms());
        booking.setConsentDataStorage(request.getConsentDataStorage());

        RoomBooking savedBooking = roomBookingRepository.save(booking);

        // Send confirmation email if user has email (optional, based on finding user by
        // phone)
        try {
            usersRepository.findByPhoneNumber(phoneNumber).ifPresent(user -> {
                if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                    String subject = "Room Booking Received";
                    String body = "Dear Devotee,\n\n" +
                            "We have received your room booking request.\n" +
                            "Reference ID: " + savedBooking.getId() + "\n" +
                            "Check-in: " + savedBooking.getCheckInDate() + "\n" +
                            "Check-out: " + savedBooking.getCheckOutDate() + "\n\n" +
                            "We will review your request and confirm shortly.";
                    emailService.sendEmail(user.getEmail(), subject, body);
                }
            });
        } catch (Exception e) {
            System.err.println("Failed to send room booking email: " + e.getMessage());
        }

        return savedBooking;
    }

    @Transactional
    public void updateBookingStatus(String bookingId, String status) {
        UUID uuid = UUID.fromString(bookingId);
        RoomBooking booking = roomBookingRepository.findById(uuid)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        roomBookingRepository.save(booking);

        // Send notification (DB + Email)
        try {
            usersRepository.findByPhoneNumber(booking.getUserId()).ifPresent(user -> {
                String subject = "Room Booking " + status;
                String body = "Dear " + user.getFullName() + ",\n\n" +
                        "Your room booking (ID: " + booking.getId() + ") has been " + status.toLowerCase() + ".\n" +
                        "Check-in: " + booking.getCheckInDate() + "\n" +
                        "Check-out: " + booking.getCheckOutDate() + "\n\n" +
                        (status.equals("APPROVED") ? "We look forward to hosting you."
                                : "Please contact us for more information.");

                // Email Update
                if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                    emailService.sendEmail(user.getEmail(), subject, body);
                }
            });
        } catch (Exception e) {
            System.err.println("Failed to send booking status email: " + e.getMessage());
        }
    }

    // Seva Booking
    public List<SevaBooking> getAllSevaBookings() {
        return sevaBookingRepository.findAll();
    }

    public List<Seva> getActiveSevas(Seva.SevaCategory category) {
        if (category != null)
            return sevaRepository.findByCategoryAndIsActiveTrue(category);
        return sevaRepository.findByIsActiveTrue();
    }

    @Transactional
    public SevaBooking initiateSevaBooking(SevaBooking booking, UUID userId) {
        Users user = usersRepository.findById(userId).orElseThrow();
        booking.setUser(user);

        Seva seva = sevaRepository.findById(booking.getSeva().getId())
                .orElseThrow(() -> new RuntimeException("Seva not found"));
        booking.setSeva(seva);
        booking.setAmountPaid(seva.getAmount());

        try {
            // Create Razorpay Order
            String orderJson = paymentService.createOrder(seva.getAmount());
            org.json.JSONObject order = new org.json.JSONObject(orderJson);
            String orderId = order.getString("id");

            booking.setRazorpayOrderId(orderId);
            booking.setStatus(SevaBooking.BookingStatus.PENDING);
            booking.setPaymentStatus(SevaBooking.PaymentStatus.PENDING);

            return sevaBookingRepository.save(booking);
        } catch (Exception e) {
            throw new RuntimeException("Error creating payment order: " + e.getMessage());
        }
    }

    @Transactional
    public SevaBooking completeSevaBooking(UUID bookingId, String paymentId, String signature) {
        SevaBooking booking = sevaBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        boolean isValid = paymentService.verifySignature(booking.getRazorpayOrderId(), paymentId, signature);

        if (isValid) {
            booking.setRazorpayPaymentId(paymentId);
            booking.setRazorpaySignature(signature);
            booking.setStatus(SevaBooking.BookingStatus.CONFIRMED);
            booking.setPaymentStatus(SevaBooking.PaymentStatus.PAID);

            // Send Confirmation Email
            try {
                String to = booking.getUser().getEmail();
                String subject = "Seva Booking Confirmed - " + booking.getSeva().getTitleEnglish();
                String body = "Dear " + booking.getDevoteeName() + ",\n\n" +
                        "Your Seva booking has been confirmed.\n\n" +
                        "Seva: " + booking.getSeva().getTitleEnglish() + "\n" +
                        "Date: " + booking.getSevaDate() + "\n" +
                        "Amount: " + booking.getAmountPaid() + "\n" +
                        "Reference ID: " + booking.getRazorpayPaymentId() + "\n\n" +
                        "Thank you for your devotion.";
                emailService.sendEmail(to, subject, body);
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
            }
        } else {
            booking.setStatus(SevaBooking.BookingStatus.FAILED);
            booking.setPaymentStatus(SevaBooking.PaymentStatus.FAILED);
        }

        return sevaBookingRepository.save(booking);
    }

    // User Booking History
    public BookingHistoryResponse getUserBookingHistory(String phoneNumber) {
        Users user = usersRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get Seva History
        List<SevaBooking> sevaBookings = sevaBookingRepository.findByUser(user);
        List<SevaHistoryResponse> sevaHistory = sevaBookings.stream()
                .map(this::convertToSevaHistoryResponse)
                .collect(Collectors.toList());

        // Get Room Bookings
        List<RoomBooking> roomBookings = roomBookingRepository.findByUserId(phoneNumber);
        List<RoomBookingStatusResponse> roomBookingResponses = roomBookings.stream()
                .map(this::convertToRoomBookingStatusResponse)
                .collect(Collectors.toList());

        BookingHistoryResponse response = new BookingHistoryResponse();
        response.setSevaHistory(sevaHistory);
        response.setRoomBookings(roomBookingResponses);

        return response;
    }

    private SevaHistoryResponse convertToSevaHistoryResponse(SevaBooking booking) {
        SevaHistoryResponse response = new SevaHistoryResponse();
        response.setId(booking.getId());
        response.setSevaTitle(booking.getSeva().getTitleEnglish());
        response.setSevaDate(booking.getSevaDate());
        response.setAmountPaid(booking.getAmountPaid());
        response.setStatus(booking.getStatus().toString());
        return response;
    }

    private RoomBookingStatusResponse convertToRoomBookingStatusResponse(RoomBooking booking) {
        RoomBookingStatusResponse response = new RoomBookingStatusResponse();
        response.setId(booking.getId());
        response.setUserId(booking.getUserId());
        response.setCheckInDate(booking.getCheckInDate());
        response.setCheckOutDate(booking.getCheckOutDate());
        response.setNumberOfGuests(booking.getNumberOfGuests());
        response.setNumberOfRooms(booking.getNumberOfRooms());
        response.setStatus(booking.getStatus());
        response.setConsentDataStorage(booking.isConsentDataStorage());
        response.setCreatedAt(booking.getCreatedAt());

        // Get user name
        usersRepository.findByPhoneNumber(booking.getUserId()).ifPresent(user -> {
            response.setUserName(user.getFullName());
        });

        return response;
    }
}
