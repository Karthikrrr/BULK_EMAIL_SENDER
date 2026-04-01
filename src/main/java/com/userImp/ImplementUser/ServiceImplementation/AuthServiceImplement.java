package com.userImp.ImplementUser.ServiceImplementation;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.userImp.ImplementUser.DTO.request.AuthRequest;
import com.userImp.ImplementUser.DTO.request.RegisterRequest;
import com.userImp.ImplementUser.DTO.response.AuthResponse;
import com.userImp.ImplementUser.Entity.Role;
import com.userImp.ImplementUser.Entity.User;
import com.userImp.ImplementUser.JWTHandler.JwtUtil;
import com.userImp.ImplementUser.Repository.UserRepository;
import com.userImp.ImplementUser.Services.AuthServices;

@Service
public class AuthServiceImplement implements AuthServices {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImplement(JwtUtil jwtUtil, UserRepository userRepository, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest registerRequest) {

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email alredy exists");
        }
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setRole(Role.ROLE_USER);
        user.setEnabled(true);

        userRepository.save(user);

        String jwt = jwtUtil.generateToken(
                org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                        .password(user.getPassword()).authorities(user.getRole().name()).build());

        AuthResponse authResponse = new AuthResponse();
        authResponse.setEmail(user.getEmail());
        authResponse.setMessage("User Registered Successfully");
        authResponse.setRole(user.getRole().name());
        authResponse.setToken(jwt);

        return authResponse;
    }

    public AuthResponse authenticate(AuthRequest request) {
         Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(), 
                request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        String jwt = jwtUtil.generateToken(userDetails);
        
        AuthResponse authResponse = new AuthResponse();
        authResponse.setEmail(user.getEmail());
        authResponse.setMessage("Login Successful");
        authResponse.setRole(user.getRole().name());
        authResponse.setToken(jwt);
        return authResponse;
    }

}
