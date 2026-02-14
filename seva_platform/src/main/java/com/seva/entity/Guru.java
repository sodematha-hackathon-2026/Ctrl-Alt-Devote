package com.seva.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;

@Entity
@Table(name = "guru_parampara")
@Document(indexName = "gurus")
@Data
public class Guru {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String nameKannada;
    private Integer orderIndex;
    private String ashramaGuru;
    private String ashramaShishya;
    private String photoURL;
    private String period;
    private String poorvashramaName;
    private String aaradhane;
    private String peetarohana;
    @Column(length = 2000)
    private String keyWorks;
    @Column(length = 4000)
    private String description;
    private String vrindavanaLocation;
    private String vrindavanaMapLink;
    private Double vrindavanaLat;
    private Double vrindavanaLong;
    private Boolean isBhootarajaru;

    // New Fields for Parampara Feature
    private Integer startYear;
    private Integer endYear;
    @Column(length = 500)
    private String shortHighlight;
    private Long ashramaGuruId;
    private Long ashramaShishyaId;
}