package com.seva.service;

import com.seva.entity.*;
import com.seva.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final FlashUpdateRepository flashUpdateRepository;
    private final TimingsRepository timingsRepository;
    private final GuruRepository guruRepository;

    private final com.seva.repository.search.GuruSearchRepository guruSearchRepository;

    private final AlbumRepository albumRepository;
    private final MediaItemRepository mediaItemRepository;

    // Flash Updates
    public List<FlashUpdate> getActiveFlashUpdates() {
        return flashUpdateRepository.findByIsActiveTrueAndExpiryDateAfter(java.time.LocalDate.now());
    }

    public FlashUpdate saveFlashUpdate(FlashUpdate update) {
        return flashUpdateRepository.save(update);
    }

    // Timings
    public List<Timings> getActiveTimings() {
        return timingsRepository.findByIsActiveTrue();
    }

    public Timings saveTiming(Timings timing) {
        return timingsRepository.save(timing);
    }

    // Guru Parampara
    public List<Guru> getAllGurus() {
        return guruRepository.findAllByOrderByOrderIndexAsc();
    }

    public Guru saveGuru(Guru guru) {
        Guru saved = guruRepository.save(guru);
        guruSearchRepository.save(saved);
        return saved;
    }

    public void deleteGuru(Long id) {
        guruRepository.deleteById(id);
        guruSearchRepository.deleteById(id);
    }

    // Gallery
    public List<Album> getAllAlbums() {
        return albumRepository.findAll();
    }

    public List<MediaItem> getAlbumMedia(Long albumId) {
        return mediaItemRepository.findByAlbumId(albumId);
    }

    public Album saveAlbum(Album album) {
        return albumRepository.save(album);
    }
}
