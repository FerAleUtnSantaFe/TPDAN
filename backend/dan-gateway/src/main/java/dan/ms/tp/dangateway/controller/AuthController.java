package dan.ms.tp.dangateway.controller;

import dan.ms.tp.dangateway.util.JwtUtil;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

@RestController
@RequestMapping("/login")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
    /*
     * Authentication, if username = admin and pass = admin, its ok, anything else
     * its wrong
     */

    @PostMapping
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        ArrayList<String> roles = new ArrayList<>();
        roles.add("ADMIN"); // Add roles to the token
        roles.add("USER"); // Add roles to the token

        // Validate credentials
        if ("admin".equals(username) && "admin".equals(password)) {
            String token = jwtUtil.generateToken(username, roles); // Generate JWT token

            // Create an HTTP-only cookie to store the token
            ResponseCookie cookie = ResponseCookie.from("authToken", token)
                    .httpOnly(true) // Prevent access via JavaScript
                    .secure(true) // Ensure the cookie is sent only over HTTPS
                    .path("/") // Cookie is valid for the entire domain
                    .maxAge(24 * 60 * 60) // Set expiration time (1 day)
                    .sameSite("Strict") // Prevent CSRF attacks
                    .build();

            return ResponseEntity.ok()
                    .header("Set-Cookie", cookie.toString())
                    .body(Map.of("message", "Login successful"));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Clear the authToken cookie
        ResponseCookie cookie = ResponseCookie.from("authToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0) // Expire the cookie immediately
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(Map.of("message", "Logged out successfully"));
    }
}