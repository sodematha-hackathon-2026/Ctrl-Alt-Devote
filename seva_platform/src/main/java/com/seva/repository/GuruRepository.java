package com.seva.repository;

import com.seva.entity.Guru;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuruRepository extends JpaRepository<Guru, Long> {
    List<Guru> findAllByOrderByOrderIndexAsc();
}
