package com.seva.repository;

import com.seva.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<Event> findByCategory(String category);
}
