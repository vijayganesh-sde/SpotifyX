package com.spotifyX.config;

import org.springframework.stereotype.Component;

import com.spotifyX.repository.TrackRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private TrackRepository trackRepository;

    @Override
    public void run(String... args) throws Exception {
        if (trackRepository.count() > 0) return;

        String sql = "INSERT INTO tracks (track_id, title, artist, album, image_url, preview_url, language, genre, duration_ms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (BufferedReader br = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/itunes_master_dataset.csv")))) {
            br.readLine(); // Skip header
            List<Object[]> batchArgs = new ArrayList<>();
            String line;

            while ((line = br.readLine()) != null) {
                // Regex to handle commas inside quotes in CSV
                String[] v = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                
                batchArgs.add(new Object[] {
                    Long.parseLong(v[0]), 
                    v[1].replace("\"", ""), 
                    v[2].replace("\"", ""), 
                    v[3].replace("\"", ""), 
                    v[4], v[5], v[6], v[7], 
                    Integer.parseInt(v[8])
                });

                if (batchArgs.size() >= 100) {
                    jdbcTemplate.batchUpdate(sql, batchArgs);
                    batchArgs.clear();
                }
            }
            jdbcTemplate.batchUpdate(sql, batchArgs); // Last batch
            System.out.println("All tracks imported successfully!");
        }
    }
}
