package com.spotifyX.repository;

import org.springframework.stereotype.Repository;

import com.spotifyX.entity.Track;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@Repository
public interface TrackRepository extends JpaRepository<Track, Long> {
    List<Track> findByTitleContainingIgnoreCase(String title);

    List<Track> findByLanguageIgnoreCase(String language);

    List<Track> findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCase(String title, String artist);
}
