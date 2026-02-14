package com.seva.controller;

import com.seva.entity.*;
import com.seva.repository.FlashUpdateRepository;
import com.seva.repository.TimingsRepository;
import com.seva.repository.EventRepository;
import com.seva.repository.BranchRepository;
import com.seva.repository.GuruRepository;
import com.seva.service.ContentService;
import com.seva.service.EventService;
import com.seva.service.BranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminContentController {

    private final ContentService contentService;
    private final EventService eventService;
    private final BranchService branchService;

    // Repositories for findById (Read operations)
    private final FlashUpdateRepository flashUpdateRepository;
    private final TimingsRepository timingsRepository;
    private final EventRepository eventRepository;
    private final BranchRepository branchRepository;
    private final GuruRepository guruRepository;
    private final com.seva.repository.AlbumRepository albumRepository;
    private final com.seva.repository.MediaItemRepository mediaItemRepository;
    private final com.seva.repository.DailyAlankaraRepository dailyAlankaraRepository;

    // --- Events ---

    @PostMapping("/events")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.saveEvent(event));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        return eventRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(event.getTitle());
                    existing.setDate(event.getDate());
                    existing.setTithi(event.getTithi());
                    existing.setDescription(event.getDescription());
                    existing.setCategory(event.getCategory());
                    return ResponseEntity.ok(eventService.saveEvent(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    // --- Branches ---

    @PostMapping("/branches")
    public ResponseEntity<Branch> createBranch(@RequestBody Branch branch) {
        return ResponseEntity.ok(branchService.saveBranch(branch));
    }

    @PutMapping("/branches/{id}")
    public ResponseEntity<Branch> updateBranch(@PathVariable java.util.UUID id, @RequestBody Branch branch) {
        return branchRepository.findById(id)
                .map(existing -> {
                    existing.setName(branch.getName());
                    existing.setAddress(branch.getAddress());
                    existing.setCity(branch.getCity());
                    existing.setState(branch.getState());
                    existing.setPincode(branch.getPincode());
                    existing.setPhone(branch.getPhone());
                    existing.setMapLink(branch.getMapLink());
                    existing.setLatitude(branch.getLatitude());
                    existing.setLongitude(branch.getLongitude());
                    return ResponseEntity.ok(branchService.saveBranch(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/branches/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable java.util.UUID id) {
        branchService.deleteBranch(id);
        return ResponseEntity.ok().build();
    }

    // --- Gurus ---

    @PostMapping("/gurus")
    public ResponseEntity<Guru> createGuru(@RequestBody Guru guru) {
        return ResponseEntity.ok(contentService.saveGuru(guru));
    }

    @PutMapping("/gurus/{id}")
    public ResponseEntity<Guru> updateGuru(@PathVariable Long id, @RequestBody Guru guru) {
        return guruRepository.findById(id)
                .map(existing -> {
                    existing.setName(guru.getName());
                    existing.setNameKannada(guru.getNameKannada());
                    existing.setOrderIndex(guru.getOrderIndex());
                    existing.setAshramaGuru(guru.getAshramaGuru());
                    existing.setAshramaShishya(guru.getAshramaShishya());
                    existing.setPhotoURL(guru.getPhotoURL());
                    existing.setPeriod(guru.getPeriod());
                    existing.setPoorvashramaName(guru.getPoorvashramaName());
                    existing.setAaradhane(guru.getAaradhane());
                    existing.setPeetarohana(guru.getPeetarohana());
                    existing.setKeyWorks(guru.getKeyWorks());
                    existing.setDescription(guru.getDescription());
                    existing.setVrindavanaLocation(guru.getVrindavanaLocation());
                    existing.setVrindavanaMapLink(guru.getVrindavanaMapLink());
                    existing.setIsBhootarajaru(guru.getIsBhootarajaru());
                    return ResponseEntity.ok(contentService.saveGuru(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/gurus/{id}")
    public ResponseEntity<Void> deleteGuru(@PathVariable Long id) {
        contentService.deleteGuru(id);
        return ResponseEntity.ok().build();
    }

    // --- Flash Updates ---

    @PostMapping("/flash-updates")
    public ResponseEntity<FlashUpdate> createFlashUpdate(@RequestBody FlashUpdate flashUpdate) {
        return ResponseEntity.ok(flashUpdateRepository.save(flashUpdate));
    }

    @PutMapping("/flash-updates/{id}")
    public ResponseEntity<FlashUpdate> updateFlashUpdate(@PathVariable Long id, @RequestBody FlashUpdate flashUpdate) {
        return flashUpdateRepository.findById(id)
                .map(existing -> {
                    existing.setMessage(flashUpdate.getMessage());
                    existing.setLink(flashUpdate.getLink());
                    existing.setIsActive(flashUpdate.getIsActive());
                    existing.setExpiryDate(flashUpdate.getExpiryDate());
                    return ResponseEntity.ok(flashUpdateRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/flash-updates/{id}")
    public ResponseEntity<Void> deleteFlashUpdate(@PathVariable Long id) {
        flashUpdateRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Timings ---

    @GetMapping("/timings")
    public ResponseEntity<List<Timings>> getAllTimings() {
        return ResponseEntity.ok(timingsRepository.findAll());
    }

    @PostMapping("/timings")
    public ResponseEntity<Timings> createTimings(@RequestBody Timings timings) {
        return ResponseEntity.ok(timingsRepository.save(timings));
    }

    @PutMapping("/timings/{id}")
    public ResponseEntity<Timings> updateTimings(@PathVariable Long id, @RequestBody Timings timings) {
        return timingsRepository.findById(id)
                .map(existing -> {
                    existing.setLocation(timings.getLocation());
                    existing.setDarshanTime(timings.getDarshanTime());
                    existing.setPrasadaTime(timings.getPrasadaTime());
                    existing.setIsActive(timings.getIsActive());
                    return ResponseEntity.ok(timingsRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Gallery / Albums ---

    @PostMapping("/gallery/albums")
    public ResponseEntity<com.seva.entity.Album> createAlbum(@RequestBody com.seva.entity.Album album) {
        return ResponseEntity.ok(albumRepository.save(album));
    }

    @PutMapping("/gallery/albums/{id}")
    public ResponseEntity<com.seva.entity.Album> updateAlbum(@PathVariable Long id,
            @RequestBody com.seva.entity.Album album) {
        return albumRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(album.getTitle());
                    existing.setDescription(album.getDescription());
                    existing.setCoverImage(album.getCoverImage());
                    return ResponseEntity.ok(albumRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/gallery/albums/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable Long id) {
        albumRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/gallery/albums/{id}/media")
    public ResponseEntity<com.seva.entity.MediaItem> addMediaToAlbum(@PathVariable Long id,
            @RequestBody com.seva.entity.MediaItem mediaItem) {
        return albumRepository.findById(id)
                .map(album -> {
                    mediaItem.setAlbum(album);
                    return ResponseEntity.ok(mediaItemRepository.save(mediaItem));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/gallery/media/{id}")
    public ResponseEntity<Void> deleteMediaItem(@PathVariable Long id) {
        mediaItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/gallery/albums/{id}/media")
    public ResponseEntity<List<com.seva.entity.MediaItem>> getAlbumMedia(@PathVariable Long id) {
        return ResponseEntity.ok(contentService.getAlbumMedia(id));
    }

    // --- Events Listing for Admin ---
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // --- Daily Alankara ---

    private final com.seva.service.S3Service s3Service;

    // ... (other fields remain the same) ...

    @PostMapping("/daily-alankara")
    public ResponseEntity<DailyAlankara> uploadDailyAlankara(@RequestBody DailyAlankara dailyAlankara) {
        // Find the latest alankara to delete its image from S3
        dailyAlankaraRepository.findTopByOrderByUploadedAtDesc().ifPresent(latest -> {
            if (latest.getImageUrl() != null) {
                try {
                    s3Service.deleteFile(latest.getImageUrl());
                } catch (Exception e) {
                    // Log error but continue with new upload
                    System.err.println("Failed to delete old alankara image: " + e.getMessage());
                }
            }
        });
        return ResponseEntity.ok(dailyAlankaraRepository.save(dailyAlankara));
    }

    @GetMapping("/daily-alankara/latest")
    public ResponseEntity<DailyAlankara> getLatestDailyAlankara() {
        return dailyAlankaraRepository.findTopByOrderByUploadedAtDesc()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
