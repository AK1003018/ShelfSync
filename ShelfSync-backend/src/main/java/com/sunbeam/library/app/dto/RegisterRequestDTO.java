package com.sunbeam.library.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    @NotBlank
    private String name;

    @NotBlank @Email
    private String email;
    
    @NotBlank
    private String phone;
    
    @NotBlank @Size(min = 6)
    private String password;
}