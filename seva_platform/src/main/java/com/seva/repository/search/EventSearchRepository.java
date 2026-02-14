package com.seva.repository.search;

import com.seva.entity.Event;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventSearchRepository extends ElasticsearchRepository<Event, Long> {
    List<Event> findByTitleContainingOrDescriptionContaining(String title, String description);
}
