package com.sunbeam.library.app.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class DashboardKpiDTO {
    private long totalMembers;
    private long activeMembers;
    private long totalBooks;
    private long totalCopies;
    private long issuedCopies;
    private BigDecimal totalAssetValue;
    // Add more KPIs as needed
}