package com.seva.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import java.util.UUID;

@Entity
@Table(name = "branches")
@Document(indexName = "branches")
@Data
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    @Column(columnDefinition = "TEXT")
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private String mapLink;
    private Double latitude;
    private Double longitude;
}
