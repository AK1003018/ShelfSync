package com.sunbeam.library.app.dto;

import com.sunbeam.library.app.enums.BookStatus;
import lombok.Data;

@Data
public class BookCopyDTO {
    private Long id;
    private Long bookId;
    private String bookName;
    private String rack;
    private BookStatus status;
}