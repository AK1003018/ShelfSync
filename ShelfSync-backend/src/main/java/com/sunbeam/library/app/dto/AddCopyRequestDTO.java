package com.sunbeam.library.app.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddCopyRequestDTO {
    @NotNull(message = "bookId is required")
    private Long bookId;

    @NotBlank(message = "Rack location cannot be blank")
    private String rack;

    @NotNull(message = "numberOfCopies is required")
    @Min(value = 1, message = "You must add at least one copy")
    private int numberOfCopies;
}