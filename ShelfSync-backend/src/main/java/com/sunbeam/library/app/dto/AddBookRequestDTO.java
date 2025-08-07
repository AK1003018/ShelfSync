package com.sunbeam.library.app.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AddBookRequestDTO {
    @NotBlank(message = "Book name cannot be blank")
    private String name;

    @NotBlank(message = "Author name cannot be blank")
    private String author;

    private String subject;

    @NotBlank(message = "ISBN cannot be blank")
    private String isbn;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
}