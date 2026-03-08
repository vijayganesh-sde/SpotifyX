package com.spotifyX.controller;

import com.spotifyX.entity.Track;
import com.spotifyX.repository.TrackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@CrossOrigin(origins = "http://localhost:3000")
public class TrackController {

    @Autowired
    private TrackRepository trackRepository;

    // This handles EVERYTHING at the base /api/tracks URL
    @GetMapping
    public List<Track> getTracks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String language) {
        
        // 1. If 'search' parameter is present (?search=...)
        System.out.println("Search: " + search + ", Language: " + language);
        if (search != null && !search.isEmpty()) {
            return trackRepository.findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCase(search, search);
        }
        
        // 2. If 'language' parameter is present (?language=...)
        if (language != null && !language.isEmpty()) {
            return trackRepository.findByLanguageIgnoreCase(language);
        }

        // 3. Default: Return everything
        return trackRepository.findAll();
    }
}