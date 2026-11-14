package com.spotifyX.utils;

import java.security.Key;
import java.sql.Date;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
@Component
public class JwtUtil {
  private final String secretKey;
  private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours

  public JwtUtil(@Value("${JWT_SECRET}") String secretKey) {
    if (secretKey.getBytes(StandardCharsets.UTF_8).length < 32) {
      throw new IllegalArgumentException("JWT_SECRET must be at least 32 bytes long");
    }
    this.secretKey = secretKey;
  }

  private Key getSignInKey() {
    byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
    return Keys.hmacShaKeyFor(keyBytes);
  }
  public String generateToken(String email) {
    return Jwts.builder()
        .setSubject(email)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
        .compact();
  }
  public String extractEmail(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSignInKey())
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

}
