package com.seva.config;

import com.seva.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CorsProperties corsProperties;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .cors(c -> c.configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/api/auth/send-otp", // only these auth endpoints are
                                                                                      // public
                                                                "/api/auth/verify-otp",
                                                                "/api/home/**",
                                                                "/api/history/**",
                                                                "/api/contact/**",
                                                                "/api/content/**", // public content read
                                                                "/api/engagement/**",
                                                                "/api/branches/**", // public branch read
                                                                "/api/search/**",
                                                                "/api/alankara/**",
                                                                "/actuator/health",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html")
                                                .permitAll()
                                                // Admin endpoints require ADMIN role
                                                .requestMatchers("/api/admin/timings/**").authenticated() // TODO:
                                                                                                          // Revert to
                                                                                                          // hasRole("ADMIN")
                                                                                                          // after
                                                                                                          // debugging
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/bookings/sevas")
                                                .permitAll() // Allow viewing sevas
                                                .requestMatchers("/api/bookings/**").authenticated() // Require login
                                                                                                     // for other
                                                                                                     // booking actions
                                                .requestMatchers("/api/auth/me").authenticated() // Require auth for /me
                                                                                                 // endpoint
                                                // Volunteer opportunities endpoints
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/volunteer-opportunities")
                                                .permitAll() // Public can view open opportunities
                                                .requestMatchers(org.springframework.http.HttpMethod.POST,
                                                                "/api/volunteer-opportunities/*/apply")
                                                .authenticated() // Allow any authenticated user to apply
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/volunteer-opportunities/my-applications")
                                                .authenticated() // Allow any authenticated user to view their
                                                                 // applications
                                                .requestMatchers("/api/volunteer-opportunities/**").hasRole("ADMIN") // Admin-only
                                                                                                                     // for
                                                                                                                     // create/update/delete
                                                .anyRequest().authenticated())
                                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(corsProperties.getAllowedOrigins());
                cfg.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                cfg.setAllowedHeaders(Arrays.asList("*"));
                cfg.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", cfg);
                return source;
        }
}