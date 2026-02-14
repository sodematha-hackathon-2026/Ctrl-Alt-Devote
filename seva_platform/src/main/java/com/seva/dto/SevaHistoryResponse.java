package com.seva.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SevaHistoryResponse {
    private UUID id;
    private String sevaTitle;
    private LocalDateTime sevaDate;
    private java.math.BigDecimal amountPaid;
    private String status;
}
