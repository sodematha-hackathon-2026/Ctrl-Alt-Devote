package com.seva.service;

import com.seva.entity.Event;
import com.seva.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final com.seva.repository.search.EventSearchRepository eventSearchRepository;

    public List<Event> getEventsBetween(LocalDate start, LocalDate end) {
        return eventRepository.findByDateBetween(start, end);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event saveEvent(Event event) {
        Event saved = eventRepository.save(event);
        try {
            eventSearchRepository.save(saved);
        } catch (Exception e) {
            System.err.println("Failed to save event to Elasticsearch: " + e.getMessage());
        }
        return saved;
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
        eventSearchRepository.deleteById(id);
    }
}
