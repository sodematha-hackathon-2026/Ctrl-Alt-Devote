package com.seva.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "media_items")
@Data
public class MediaItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "album_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Album album;

    @Enumerated(EnumType.STRING)
    private MediaType type;

    private String url;

    public enum MediaType {
        PHOTO, VIDEO
    }
}
