package com.sunbeam.library.app.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class IssueRecordDTO {
private Long id;
private String bookName;
private String bookAuthor;
private Long copyId;
private LocalDate issueDate;
private LocalDate dueDate;
private LocalDate returnDate;
private BigDecimal fine;
}