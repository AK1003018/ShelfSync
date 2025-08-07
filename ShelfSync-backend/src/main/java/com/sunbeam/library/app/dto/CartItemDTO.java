package com.sunbeam.library.app.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CartItemDTO {
    private Long cartItemId;
    private Long copyId;
    private String bookName;
    private String bookAuthor;
    private String rack;
    private LocalDateTime addedAt;
}