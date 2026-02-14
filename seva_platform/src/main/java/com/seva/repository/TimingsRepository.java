package com.seva.repository;

import com.seva.entity.Timings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimingsRepository extends JpaRepository<Timings, Long> {
    List<Timings> findByIsActiveTrue();
}
