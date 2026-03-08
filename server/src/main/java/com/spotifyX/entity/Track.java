package com.spotifyX.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tracks")
@Data
public class Track {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long trackId; // The ID from iTunes
    private String title;
    private String artist;
    private String album;
    
    @Column(length = 500) // URLs can be long
    private String imageUrl;
    
    @Column(length = 500)
    private String previewUrl;
    
    private String language;
    private String genre;
    private Integer durationMs;
}
