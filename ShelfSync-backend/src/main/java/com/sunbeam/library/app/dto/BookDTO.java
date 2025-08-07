package com.sunbeam.library.app.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class BookDTO {
    private Long id;
    private String name;
    private String author;
    private String subject;
    private String isbn;
    private BigDecimal price;
    private long totalCopies;
    private long availableCopies;
}