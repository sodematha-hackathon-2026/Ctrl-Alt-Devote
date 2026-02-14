package com.seva.controller;

import com.seva.entity.VolunteerApplication;
import com.seva.entity.VolunteerOpportunity;
import com.seva.service.VolunteerOpportunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/volunteer-opportunities")
@RequiredArgsConstructor
public class VolunteerOpportunityController {

    private final VolunteerOpportunityService service;

    @GetMapping
    public ResponseEntity<List<VolunteerOpportunity>> getAvailableOpportunities() {
        return ResponseEntity.ok(service.getOpenOpportunities());
    }

    @GetMapping("/all") // Admin endpoint
    public ResponseEntity<List<VolunteerOpportunity>> getAllOpportunities() {
        return ResponseEntity.ok(service.getAllOpportunities());
    }

    @PostMapping
    public ResponseEntity<VolunteerOpportunity> createOpportunity(@RequestBody VolunteerOpportunity opportunity) {
        return ResponseEntity.ok(service.createOpportunity(opportunity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VolunteerOpportunity> updateOpportunity(@PathVariable UUID id,
            @RequestBody VolunteerOpportunity opportunity) {
        return ResponseEntity.ok(service.updateOpportunity(id, opportunity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOpportunity(@PathVariable UUID id) {
        service.deleteOpportunity(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<Void> applyForOpportunity(@PathVariable UUID id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        service.applyForOpportunity(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<List<VolunteerApplication>> getApplicationsForOpportunity(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getApplicationsForOpportunity(id));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<VolunteerApplication>> getMyApplications(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(service.getMyApplications(principal.getName()));
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<VolunteerApplication> updateApplicationStatus(
            @PathVariable UUID applicationId,
            @RequestParam VolunteerApplication.Status status) {
        return ResponseEntity.ok(service.updateApplicationStatus(applicationId, status));
    }
}
