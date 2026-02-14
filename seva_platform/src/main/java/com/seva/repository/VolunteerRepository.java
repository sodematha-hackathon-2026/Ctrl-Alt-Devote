package com.seva.repository;

import com.seva.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, UUID> {
    Optional<Volunteer> findByUserId(UUID userId);
}
