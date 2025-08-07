package com.sunbeam.library.app.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CheckoutResponseDTO {
    private String status;
    private List<IssueRecordDTO> borrowedBooks;
    private BigDecimal amountPaid;
    private String paymentDetails; // e.g., "Membership Fee + Fines"
}