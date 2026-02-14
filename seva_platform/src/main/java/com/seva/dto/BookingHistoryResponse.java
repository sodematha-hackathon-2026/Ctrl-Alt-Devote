package com.seva.dto;

import lombok.Data;
import java.util.List;

@Data
public class BookingHistoryResponse {
    private List<SevaHistoryResponse> sevaHistory;
    private List<RoomBookingStatusResponse> roomBookings;
}
