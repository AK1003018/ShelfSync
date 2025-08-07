package com.sunbeam.library.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordDTO {
    @NotBlank
    private String oldPassword;
    @NotBlank @Size(min = 6)
    private String newPassword;
}