package com.spotifyX.controller;

import java.util.List;

import com.spotifyX.entity.Track;

import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "http://localhost:3000")
public class PlaylistController {

    @Autowired private PlaylistRepository playlistRepository;
    @Autowired private TrackRepository trackRepository;

    @GetMapping
    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    @PostMapping
    public Playlist createPlaylist(@RequestBody @NonNull Playlist playlist) {
        return playlistRepository.save(playlist);
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
}
