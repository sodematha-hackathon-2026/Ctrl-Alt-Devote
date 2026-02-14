package com.seva.repository;

import com.seva.entity.MediaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaItemRepository extends JpaRepository<MediaItem, Long> {
    java.util.List<MediaItem> findByAlbumId(Long albumId);
}
