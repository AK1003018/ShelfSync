package com.sunbeam.library.app.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class MemberProfileDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private boolean membershipActive;
    private LocalDate membershipDueDate;
}