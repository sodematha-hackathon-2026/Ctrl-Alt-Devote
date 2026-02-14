package com.seva.config;

import com.seva.entity.Event;
import com.seva.entity.Guru;
import com.seva.repository.EventRepository;
import com.seva.repository.GuruRepository;
import com.seva.repository.search.EventSearchRepository;
import com.seva.repository.search.GuruSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SearchIndexInitializer implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final EventSearchRepository eventSearchRepository;

    private final GuruRepository guruRepository;
    private final GuruSearchRepository guruSearchRepository;

    private final com.seva.repository.BranchRepository branchRepository;
    private final com.seva.repository.search.BranchSearchRepository branchSearchRepository;

    @Override
    public void run(String... args) {
        log.info("Checking Elasticsearch indices...");

        try {
            // Sync Events
            if (eventSearchRepository.count() == 0) {
                log.info("Events index is empty. Syncing from database...");
                List<Event> events = eventRepository.findAll();
                eventSearchRepository.saveAll(events);
                log.info("Synced {} events.", events.size());
            } else {
                log.info("Events index already contains data.");
            }

            // Sync Gurus
            if (guruSearchRepository.count() == 0) {
                log.info("Guru index is empty. Syncing from database...");
                List<Guru> gurus = guruRepository.findAll();
                guruSearchRepository.saveAll(gurus);
                log.info("Synced {} gurus.", gurus.size());
            } else {
                log.info("Guru index already contains data.");
            }

            // Sync Branches
            if (branchSearchRepository.count() == 0) {
                log.info("Branch index is empty. Syncing from database...");
                List<com.seva.entity.Branch> branches = branchRepository.findAll();
                branchSearchRepository.saveAll(branches);
                log.info("Synced {} branches.", branches.size());
            } else {
                log.info("Branch index already contains data.");
            }

            log.info("Elasticsearch index initialization completed.");

        } catch (Exception e) {
            log.error("Failed to initialize Elasticsearch indices: {}", e.getMessage(), e);
        }
    }
}
