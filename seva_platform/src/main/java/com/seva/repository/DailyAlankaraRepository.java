package com.seva.repository;

import com.seva.entity.DailyAlankara;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyAlankaraRepository extends JpaRepository<DailyAlankara, UUID> {
    Optional<DailyAlankara> findTopByOrderByUploadedAtDesc();

    boolean existsByUploadedAtAfter(LocalDateTime date);

    java.util.List<DailyAlankara> findByUploadedAtBefore(LocalDateTime dateTime);
}
