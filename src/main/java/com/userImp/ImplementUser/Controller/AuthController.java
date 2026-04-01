package com.userImp.ImplementUser.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.userImp.ImplementUser.DTO.request.AuthRequest;
import com.userImp.ImplementUser.DTO.request.RegisterRequest;
import com.userImp.ImplementUser.DTO.response.AuthResponse;
import com.userImp.ImplementUser.Services.AuthServices;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {
    private final AuthServices authService;

    public AuthController(AuthServices authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = new AuthResponse();
         try {
            authResponse = authService.register(request);
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
             authResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(
               authResponse
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@Valid @RequestBody AuthRequest request) {
        AuthResponse authResponse = new AuthResponse();
         try {
            authResponse = authService.authenticate(request);
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
             authResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(
               authResponse
            );
        }
    }
}
