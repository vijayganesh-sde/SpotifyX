package com.spotifyX.utils;

import java.security.Key;
import java.sql.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
@Component
public class JwtUtil {
  private final String SECRET_KEY = "this_is_a_very_secret_key_32_characters_long_!!!";
  private final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours

  private Key getSignInKey() {
    byte[] keyBytes = SECRET_KEY.getBytes();
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
