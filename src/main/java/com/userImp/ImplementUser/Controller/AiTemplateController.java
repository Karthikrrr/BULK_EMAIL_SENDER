package com.userImp.ImplementUser.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.userImp.ImplementUser.DTO.request.AiImproveRequest;
import com.userImp.ImplementUser.DTO.request.AiTemplateRequest;
import com.userImp.ImplementUser.DTO.response.AiTemplateResponse;
import com.userImp.ImplementUser.Services.GeminiServices;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/ai-templates")
@CrossOrigin("*")
@Slf4j
public class AiTemplateController {

    private final GeminiServices geminiServices;

    public AiTemplateController(GeminiServices geminiServices) {
        this.geminiServices = geminiServices;
    }

     @PostMapping("/generate")
    public ResponseEntity<AiTemplateResponse> generateTemplate(
            @RequestBody AiTemplateRequest request,
            Authentication authentication) {
        
        try {
            String generatedTemplate = geminiServices.generateEmailTemplate(request.getPrompt());
            return ResponseEntity.ok(AiTemplateResponse.builder()
                    .success(true)
                    .template(generatedTemplate)
                    .message("Template generated successfully using Gemini AI")
                    .build());
        } catch (Exception e) {
            log.error("Template generation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AiTemplateResponse.builder()
                            .success(false)
                            .message("Failed to generate template: " + e.getMessage())
                            .build());
        }
    }
    
    @PostMapping("/improve")
    public ResponseEntity<AiTemplateResponse> improveTemplate(
            @RequestBody AiImproveRequest request,
            Authentication authentication) {
        
        try {
            String improvedTemplate = geminiServices.improveEmailTemplate(
                request.getExistingTemplate(), 
                request.getImprovementPrompt()
            );
            return ResponseEntity.ok(AiTemplateResponse.builder()
                    .success(true)
                    .template(improvedTemplate)
                    .message("Template improved successfully using Gemini AI")
                    .build());
        } catch (Exception e) {
            log.error("Template improvement failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AiTemplateResponse.builder()
                            .success(false)
                            .message("Failed to improve template: " + e.getMessage())
                            .build());
        }
    }
    
    // Add health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "OK", "aiProvider", "Gemini"));
    }
}
