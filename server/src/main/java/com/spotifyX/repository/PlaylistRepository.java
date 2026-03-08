package com.spotifyX.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.spotifyX.entity.Playlist;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {}