package com.sunbeam.library.app.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class MemberDashboardDTO {
    // Welcome Section Data
    private String memberName;
    private boolean isMembershipActive;
    private LocalDate membershipDueDate;

    // KPI / Stats Grid Data
    private int currentlyBorrowedCount;
    private int totalBooksReadCount; // Represents total borrowing history
    private BigDecimal outstandingFines;

    // Recent Activity Data (simplified version)
    private List<IssueRecordDTO> recentActivity;
}