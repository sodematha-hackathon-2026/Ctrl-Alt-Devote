package com.seva.service;

import com.seva.entity.DailyAlankara;
import com.seva.repository.DailyAlankaraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DailyAlankaraService {

    private final DailyAlankaraRepository repository;

    public DailyAlankara saveAlankara(String imageUrl) {
        DailyAlankara alankara = new DailyAlankara();
        alankara.setImageUrl(imageUrl);
        return repository.save(alankara);
    }

    public Optional<DailyAlankara> getLatestActive() {
        Optional<DailyAlankara> latest = repository.findTopByOrderByUploadedAtDesc();
        if (latest.isPresent()) {
            LocalDateTime uploadedAt = latest.get().getUploadedAt();
            // Visible for 24 hours
            if (uploadedAt.isAfter(LocalDateTime.now().minusHours(24))) {
                return latest;
            }
        }
        return Optional.empty();
    }

    public boolean hasUploadedToday() {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        return repository.existsByUploadedAtAfter(startOfDay);
    }
}
