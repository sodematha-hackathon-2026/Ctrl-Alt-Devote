package com.seva.service;

import com.seva.repository.search.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final GuruSearchRepository guruSearchRepository;
    private final EventSearchRepository eventSearchRepository;
    private final BranchSearchRepository branchSearchRepository;

    public Map<String, Object> globalSearch(String query) {
        Map<String, Object> results = new HashMap<>();

        results.put("gurus", guruSearchRepository.findByNameContainingOrDescriptionContaining(query, query));
        results.put("events", eventSearchRepository.findByTitleContainingOrDescriptionContaining(query, query));
        results.put("branches",
                branchSearchRepository.findByNameContainingOrCityContainingOrStateContaining(query, query, query));

        return results;
    }
}
