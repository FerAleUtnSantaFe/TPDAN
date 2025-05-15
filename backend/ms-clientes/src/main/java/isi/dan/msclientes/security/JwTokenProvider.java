package isi.dan.msclientes.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

@Component
public class JwTokenProvider {

    private static final String SECRET = "KxFNTyGtiW1Rq4wyR2BVxhaqwWF37xsy"; // Secure key
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes()); // Convert to SecretKey

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public List<SimpleGrantedAuthority> getAuthorities(String token) {
        List<String> roles = extractRoles(token);

        return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role)) // Prefix roles with "ROLE_"
                    .collect(Collectors.toList());
    }

    public Claims getClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token)
                .getBody();
    }

    public List<String> extractRoles(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
        return claims.get("roles", List.class); // Extract roles from the token
    }
}
