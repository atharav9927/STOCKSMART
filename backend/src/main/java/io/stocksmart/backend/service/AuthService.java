package io.stocksmart.backend.service;

import io.stocksmart.backend.dto.AuthDto;
import io.stocksmart.backend.entity.UserEntity;
import io.stocksmart.backend.repository.UserRepository;
import io.stocksmart.backend.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String token = tokenProvider.generateToken(
                user.getEmail(),
                user.getRole().name().toLowerCase(),
                user.getName(),
                user.getAssignedLocationIds()
        );

        AuthDto.UserInfo userInfo = new AuthDto.UserInfo(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name().toLowerCase(),
                user.getAssignedLocationIds()
        );

        return new AuthDto.LoginResponse(token, userInfo);
    }

    public AuthDto.UserInfo getCurrentUser(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return new AuthDto.UserInfo(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name().toLowerCase(),
                user.getAssignedLocationIds()
        );
    }
}
