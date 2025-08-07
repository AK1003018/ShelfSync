package com.sunbeam.library.app.controller;

import com.sunbeam.library.app.dto.DashboardKpiDTO;
import com.sunbeam.library.app.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasRole('OWNER')")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @GetMapping("/dashboard/kpi")
    public ResponseEntity<DashboardKpiDTO> getDashboardKpis() {
        return ResponseEntity.ok(ownerService.getDashboardKpis());
    }

    // Additional endpoints for detailed reports would go here
    // e.g., @GetMapping("/reports/financial")
    // e.g., @GetMapping("/reports/assets")
}