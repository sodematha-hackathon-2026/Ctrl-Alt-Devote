package com.seva.service;

import com.seva.entity.DailyAlankara;
import com.seva.repository.DailyAlankaraRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlankaraCleanupService {

    private final DailyAlankaraRepository dailyAlankaraRepository;
    private final S3Service s3Service;

    /**
     * Runs every hour to check for Alankara images older than 24 hours.
     * Deletes them from S3 and the database.
     */
    @Scheduled(cron = "0 0 * * * *") // Runs at the top of every hour
    @Transactional
    public void cleanupOldAlankara() {
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        List<DailyAlankara> oldRecords = dailyAlankaraRepository.findByUploadedAtBefore(twentyFourHoursAgo);

        if (oldRecords.isEmpty()) {
            return;
        }

        log.info("Found {} old Alankara records to cleanup", oldRecords.size());

        for (DailyAlankara record : oldRecords) {
            try {
                if (record.getImageUrl() != null && !record.getImageUrl().isEmpty()) {
                    s3Service.deleteFile(record.getImageUrl());
                    log.info("Deleted S3 image for Alankara ID: {}", record.getId());
                }
                dailyAlankaraRepository.delete(record);
                log.info("Deleted Alankara record ID: {} from DB", record.getId());
            } catch (Exception e) {
                log.error("Failed to cleanup Alankara ID: {}", record.getId(), e);
            }
        }
    }
}
