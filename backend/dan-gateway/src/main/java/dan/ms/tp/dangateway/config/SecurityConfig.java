package dan.ms.tp.dangateway.config;

import dan.ms.tp.dangateway.util.JwtUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpCookie;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * Configures the security filter chain for the application.
     *
     * @param http The ServerHttpSecurity object to configure.
     * @return The configured SecurityWebFilterChain.
     */
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http.csrf(csrf -> csrf.disable()) // Disable CSRF protection for simplicity
                .authorizeExchange(authz -> authz
                        .pathMatchers("/login").permitAll() // Allow public access to login endpoint
                        .pathMatchers("/actuator/prometheus/**").permitAll() // Allow public access to Prometheus metrics
                        .pathMatchers("/api/clientes/4AD4-$y38r6mD5TmqQ6=/**").permitAll()
                        .pathMatchers("/api/productos/4AD4-$y38r6mD5TmqQ6=/**").permitAll()
                        .pathMatchers("/api/pedidos/4AD4-$y38r6mD5TmqQ6=/**").permitAll()
                        .pathMatchers("/api/v1/**").permitAll()
                        .anyExchange().authenticated() // Secure all other endpoints
                )
                .addFilterAt(jwtAuthenticationWebFilter(), SecurityWebFiltersOrder.AUTHENTICATION) // Add JWT validation
                                                                                                   // filter
                .formLogin(log -> log.disable()) // Disable default form login
                .httpBasic(httpbsc -> httpbsc.disable()); // Disable basic authentication
        return http.build();
    }

    @Bean
    public AuthenticationWebFilter jwtAuthenticationWebFilter() {
        AuthenticationWebFilter filter = new AuthenticationWebFilter(authenticationManager());
        filter.setServerAuthenticationConverter(exchange -> {
            // Extract the token from cookies
            String token = getTokenFromCookies(exchange.getRequest());
            if (token != null) {
                return Mono.just(new UsernamePasswordAuthenticationToken(token, token));
            }
            return Mono.empty();
        });
        filter.setSecurityContextRepository(securityContextRepository());
        return filter;
    }

    /**
     * Extracts the JWT token from cookies.
     *
     * @param request The HTTP request.
     * @return The JWT token if present, otherwise null.
     */
    private String getTokenFromCookies(ServerHttpRequest request) {
        if (request.getCookies() != null) {
            List<HttpCookie> cookies = request.getCookies().get("authToken"); // Match the cookie name
            if (cookies != null && !cookies.isEmpty()) {
                return cookies.get(0).getValue(); // Return the first cookie value
            }
        }
        return null;
    }

    @Bean
    public ReactiveAuthenticationManager authenticationManager() {
        return authentication -> {
            String token = authentication.getCredentials().toString();
            log.info("Validating token: {}", token);

            if (!jwtUtil.validateToken(token)) {
                log.warn("Invalid token received: {}", token);
                return Mono.error(new BadCredentialsException("Invalid JWT token"));
            }

            String username = jwtUtil.extractUsername(token);
            if (username == null || username.trim().isEmpty()) {
                log.warn("Token is valid but subject (username) is missing or empty");
                return Mono.error(new BadCredentialsException("JWT token does not contain a valid subject (username)"));
            }

            List<String> roles = jwtUtil.extractRoles(token);

            List<GrantedAuthority> authorities = new ArrayList<>(); // Initialize authorities list
            if (roles == null || roles.isEmpty()) {
                log.warn("Token is valid but roles are missing. Assigning USER role by default.");
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            } else {
                authorities = roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role)) // Prefix roles with "ROLE_"
                        .collect(Collectors.toList());
            }

            UserDetails user = User
                    .withUsername(username)
                    .password("")
                    .authorities(authorities) // Set authorities from the token
                    .build();

            log.info("Authenticated user: {} with roles: {}", username, roles);
            return Mono.just(new UsernamePasswordAuthenticationToken(user, token, user.getAuthorities()));
        };
    }

    @Bean
    public ServerSecurityContextRepository securityContextRepository() {
        return new WebSessionServerSecurityContextRepository();
    }
}