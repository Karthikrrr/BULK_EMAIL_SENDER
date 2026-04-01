package com.userImp.ImplementUser.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.userImp.ImplementUser.DTO.EmailHistoryDTO;
import com.userImp.ImplementUser.DTO.EmailHistoryDetailDTO;
import com.userImp.ImplementUser.Services.EmailHistoryServices;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/email-history")
@RequiredArgsConstructor
@Validated
@CrossOrigin("*")
public class EmailHistoryController {
    
    private final EmailHistoryServices emailHistoryService;
    
    @GetMapping
    public ResponseEntity<?> getUserEmailHistory(Authentication authentication) {
        try {
            String username = authentication.getName();
            List<EmailHistoryDTO> history = emailHistoryService.getUserEmailHistory(username);
            return ResponseEntity.ok(history);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Server error", "message", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmailHistoryDetail(
            @PathVariable Long id,
            Authentication authentication) {
        
        try {
            String username = authentication.getName();
            EmailHistoryDetailDTO detail = emailHistoryService.getEmailHistoryDetail(id, username);
            return ResponseEntity.ok(detail);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Access denied") || e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied", "message", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Not found", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Server error", "message", e.getMessage()));
        }
    }
    
}