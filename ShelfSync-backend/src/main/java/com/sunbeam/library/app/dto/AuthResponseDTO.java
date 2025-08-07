package com.sunbeam.library.app.dto;

import com.sunbeam.library.app.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String email;
    private Role role;
}