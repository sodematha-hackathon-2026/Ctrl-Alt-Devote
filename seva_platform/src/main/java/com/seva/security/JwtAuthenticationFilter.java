package com.seva.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@lombok.extern.slf4j.Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final com.seva.repository.UsersRepository usersRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String phoneNumber = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                phoneNumber = jwtUtil.extractPhoneNumber(jwt);
            } catch (Exception e) {
                log.error("JWT Token extraction failed: {}", e.getMessage());
            }
        }

        if (phoneNumber != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(jwt, phoneNumber)) {
                var userOpt = usersRepository.findByPhoneNumber(phoneNumber);
                var authorities = new ArrayList<org.springframework.security.core.authority.SimpleGrantedAuthority>();

                if (userOpt.isPresent()) {
                    var user = userOpt.get();
                    if (user.getRole() != null) {
                        String roleWithPrefix = "ROLE_" + user.getRole().name();
                        authorities.add(
                                new org.springframework.security.core.authority.SimpleGrantedAuthority(roleWithPrefix));
                        log.info("User {} authenticated with role: {}", phoneNumber, roleWithPrefix);
                    } else {
                        authorities.add(
                                new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER"));
                        log.info("User {} authenticated with default ROLE_USER", phoneNumber);
                    }
                } else {
                    authorities.add(
                            new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER"));
                    log.warn("User {} not found in database, using default ROLE_USER", phoneNumber);
                }

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        phoneNumber, null, authorities);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }
}
