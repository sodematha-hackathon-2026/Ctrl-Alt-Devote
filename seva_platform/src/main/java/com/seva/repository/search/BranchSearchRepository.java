package com.seva.repository.search;

import com.seva.entity.Branch;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BranchSearchRepository extends ElasticsearchRepository<Branch, UUID> {
    List<Branch> findByNameContainingOrCityContainingOrStateContaining(String name, String city, String state);
}
