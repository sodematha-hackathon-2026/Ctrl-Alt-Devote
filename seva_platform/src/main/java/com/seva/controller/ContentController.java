package com.seva.controller;

import com.seva.entity.Album;
import com.seva.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class ContentController {
    private final ContentService contentService;
    private final com.seva.service.EventService eventService;

    @GetMapping("/guru")
    public ResponseEntity<List<com.seva.entity.Guru>> getAllGurus() {
        return ResponseEntity.ok(contentService.getAllGurus());
    }

    @GetMapping("/gallery/albums")
    public ResponseEntity<List<Album>> getAlbums() {
        return ResponseEntity.ok(contentService.getAllAlbums());
    }

    @GetMapping("/gallery/albums/{id}/media")
    public ResponseEntity<List<com.seva.entity.MediaItem>> getAlbumMedia(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getAlbumMedia(id));
    }

    @GetMapping("/timings")
    public ResponseEntity<List<com.seva.entity.Timings>> getTimings() {
        return ResponseEntity.ok(contentService.getActiveTimings());
    }

    @GetMapping("/events")
    public ResponseEntity<List<com.seva.entity.Event>> getEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
}
