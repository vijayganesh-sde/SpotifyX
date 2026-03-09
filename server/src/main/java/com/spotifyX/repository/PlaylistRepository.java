package com.spotifyX.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spotifyX.entity.Playlist;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    // Find all playlists belonging to a specific username
    List<Playlist> findByUser_Username(String username);

    List<Playlist> findByUser_Email(String email);
    
    // Find a specific playlist (like "Liked Songs") for a specific user
    Optional<Playlist> findByNameAndUser_Username(String name, String username);
}