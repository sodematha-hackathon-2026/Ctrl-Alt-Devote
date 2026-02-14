package com.seva.controller;

import com.seva.dto.VolunteerDTO;
import com.seva.entity.Volunteer;
import com.seva.service.VolunteerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/volunteers")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;

    @PostMapping("/register")
    public ResponseEntity<Volunteer> registerVolunteer(@RequestBody VolunteerDTO volunteerDTO) {
        return ResponseEntity.ok(volunteerService.registerVolunteer(volunteerDTO));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Volunteer> getVolunteerByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(volunteerService.getVolunteerByUserId(userId));
    }
}
