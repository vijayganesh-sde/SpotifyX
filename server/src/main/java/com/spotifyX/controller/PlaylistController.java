package com.spotifyX.controller;

import java.security.Principal;
import java.util.List;

import com.spotifyX.entity.Track;
import com.spotifyX.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spotifyX.entity.Playlist;
import com.spotifyX.repository.PlaylistRepository;
import com.spotifyX.repository.TrackRepository;
import com.spotifyX.repository.UserRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "http://localhost:3000")
public class PlaylistController {

    @Autowired private PlaylistRepository playlistRepository;
    @Autowired private TrackRepository trackRepository;
    @Autowired private UserRepository userRepository;

    @GetMapping
    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Playlist> createPlaylist(@RequestBody Playlist playlist, Principal principal) {
      if (principal == null) {
          return ResponseEntity.status(401).build();
      }

      // 1. Get the username from the JWT/Security Context
      String useremail = principal.getName();

      // 2. Find the actual User entity in your DB
      User user = userRepository.findByEmail(useremail)
              .orElseThrow(() -> new RuntimeException("User not found: " + useremail));

      // 3. Link the user to the playlist before saving
      playlist.setUser(user);

      // 4. Save and return
      Playlist savedPlaylist = playlistRepository.save(playlist);
      return ResponseEntity.ok(savedPlaylist);
  }

    @PostMapping("/{playlistId}/add/{trackId}")
    public Playlist addTrackToPlaylist(@PathVariable @NonNull Long playlistId, @PathVariable @NonNull Long trackId) {
        Playlist playlist = playlistRepository.findById(playlistId).orElseThrow();
        Track track = trackRepository.findById(trackId).orElseThrow();
        
        if (!playlist.getTracks().contains(track)) {
            playlist.getTracks().add(track);
        }
        return playlistRepository.save(playlist);
    }

    @PostMapping("/toggle-like/{trackId}")
    @Transactional
    public ResponseEntity<?> toggleLike(@PathVariable @NonNull Long trackId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        String useremail = principal.getName();
        System.out.println("Toggling like for track ID: " + trackId + " by user: " + useremail);
        
        User user = userRepository.findByEmail(useremail)
                .orElseThrow(() -> new RuntimeException("User not found: " + useremail));

        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Track not found with ID: " + trackId));

        Playlist likedPlaylist = playlistRepository.findByUser_Email(useremail)
                .stream()
                .filter(p -> "Liked Songs".equals(p.getName()))
                .findFirst()
                .orElseGet(() -> {
                    Playlist p = new Playlist();
                    p.setName("Liked Songs");
                    p.setUser(user);
                    return playlistRepository.save(p);
                });

        if (likedPlaylist.getTracks().contains(track)) {
            likedPlaylist.getTracks().remove(track);
        } else {
            likedPlaylist.getTracks().add(track);
        }

        Playlist saved = playlistRepository.save(likedPlaylist);
        return ResponseEntity.ok(saved);
    }
}
