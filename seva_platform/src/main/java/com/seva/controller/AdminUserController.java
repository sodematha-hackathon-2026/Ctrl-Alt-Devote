package com.seva.controller;

import com.seva.entity.Users;
import com.seva.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UsersRepository usersRepository;

    @GetMapping
    public ResponseEntity<Page<Users>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(usersRepository.findAll(PageRequest.of(page, size)));
    }

    @GetMapping("/export")
    public ResponseEntity<List<Users>> exportUsers() {
        return ResponseEntity.ok(usersRepository.findAll());
    }

    @PutMapping("/{id}/volunteer")
    public ResponseEntity<Users> toggleVolunteerStatus(
            @PathVariable UUID id,
            @RequestParam Boolean isVolunteer) {
        return usersRepository.findById(id)
                .map(user -> {
                    user.setIsVolunteer(isVolunteer);
                    user.setVolunteerRequest(false);
                    return ResponseEntity.ok(usersRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
