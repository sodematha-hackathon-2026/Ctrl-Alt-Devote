package com.seva.controller;

import com.seva.entity.DailyAlankara;
import com.seva.service.DailyAlankaraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AlankaraController {

    private final DailyAlankaraService service;

    @GetMapping("/alankara/latest")
    public ResponseEntity<DailyAlankara> getLatestActiveAlankara() {
        return service.getLatestActive()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/admin/alankara")
    public ResponseEntity<DailyAlankara> uploadAlankara(@RequestBody Map<String, String> body) {
        String imageUrl = body.get("imageUrl");
        if (imageUrl == null || imageUrl.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.saveAlankara(imageUrl));
    }

    @GetMapping("/admin/alankara/status")
    public ResponseEntity<Map<String, Boolean>> checkUploadStatus() {
        boolean uploaded = service.hasUploadedToday();
        return ResponseEntity.ok(Map.of("uploadedToday", uploaded));
    }
}
