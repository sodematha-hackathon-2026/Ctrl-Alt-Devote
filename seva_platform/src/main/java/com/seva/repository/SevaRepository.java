package com.seva.repository;

import com.seva.entity.Seva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SevaRepository extends JpaRepository<Seva, UUID> {
    List<Seva> findByIsActiveTrue();

    List<Seva> findByCategoryAndIsActiveTrue(Seva.SevaCategory category);
}
