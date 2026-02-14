package com.seva.repository;

import com.seva.entity.VolunteerOpportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VolunteerOpportunityRepository extends JpaRepository<VolunteerOpportunity, UUID> {
    List<VolunteerOpportunity> findByStatusOrderByCreatedAtDesc(VolunteerOpportunity.Status status);
}
