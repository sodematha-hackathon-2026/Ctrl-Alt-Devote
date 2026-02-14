package com.seva.repository.search;

import com.seva.entity.Guru;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuruSearchRepository extends ElasticsearchRepository<Guru, Long> {
    List<Guru> findByNameContainingOrDescriptionContaining(String name, String description);
}
