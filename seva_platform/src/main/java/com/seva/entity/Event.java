package com.seva.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import java.time.LocalDate;

@Entity
@Table(name = "events")
@Document(indexName = "events")
@Data
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private LocalDate date;
    private String tithi;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageURL;

    private String category;

    private Boolean notificationSent = false;
}
