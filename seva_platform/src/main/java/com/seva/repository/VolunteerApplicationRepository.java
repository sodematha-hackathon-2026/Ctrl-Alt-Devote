package com.seva.repository;

import com.seva.entity.VolunteerApplication;
import com.seva.entity.VolunteerOpportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VolunteerApplicationRepository extends JpaRepository<VolunteerApplication, UUID> {
    List<VolunteerApplication> findByOpportunity(VolunteerOpportunity opportunity);

    List<VolunteerApplication> findByOpportunityId(UUID opportunityId);

    Optional<VolunteerApplication> findByUserIdAndOpportunityId(UUID userId, UUID opportunityId);

    List<VolunteerApplication> findByUserId(UUID userId);
}
