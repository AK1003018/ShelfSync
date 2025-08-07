package com.sunbeam.library.app.dto;

import com.sunbeam.library.app.enums.PaymentType;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PaymentDTO {
    private Long id;
    private BigDecimal amount;
    private PaymentType type;
    private LocalDateTime transactionTime;
    private LocalDate dueDate; // For membership
}
