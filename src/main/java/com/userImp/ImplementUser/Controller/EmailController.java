package com.userImp.ImplementUser.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.userImp.ImplementUser.DTO.request.BulkEmailRequest;
import com.userImp.ImplementUser.DTO.response.BulkEmailResponse;
import com.userImp.ImplementUser.DTO.response.TemplateEmailResponse;
import com.userImp.ImplementUser.Services.EmailServices;
import com.userImp.ImplementUser.Services.ExcelProcessingServices;
import com.userImp.ImplementUser.Services.TemplateServices;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
@Validated
@Slf4j
@CrossOrigin("*")
public class EmailController {
    private final EmailServices emailService;
    private final ExcelProcessingServices excelProcessingService;
    private final TemplateServices templateService;

  @PostMapping(value = "/bulk-with-template", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TemplateEmailResponse> sendBulkEmailWithTemplate(
            @RequestParam("excelFile") MultipartFile excelFile,
            @RequestParam("subject") String subject,
            @RequestParam("htmlTemplate") String htmlTemplate,
            @RequestParam(value = "templateName", required = false) String templateName,
            Authentication authentication) {
        
        try {
            if (excelFile.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(TemplateEmailResponse.builder()
                        .success(false)
                        .message("Excel file is required")
                        .build());
            }            
            List<Map<String, String>> excelData = excelProcessingService.processExcelFile(excelFile);
            excelProcessingService.validateExcelData(excelData);
            
            int sentCount = 0;
            List<String> failedEmails = new ArrayList<>();
            
            for (Map<String, String> rowData : excelData) {
                try {
                    String processedContent = templateService.processTemplate(htmlTemplate, rowData);
                    String fullHtml = templateService.wrapInHtmlTemplate(processedContent, 
                        templateName != null ? templateName : "default-template");
                    
                    emailService.sendEmail(rowData.get("email"), subject, fullHtml);
                    sentCount++;
                    Thread.sleep(100);
                } catch (Exception e) {
                    failedEmails.add(rowData.get("email"));
                }
            }
            
            TemplateEmailResponse response = TemplateEmailResponse.builder()
                .success(sentCount > 0)
                .message(String.format("Sent %d out of %d emails", sentCount, excelData.size()))
                .totalEmails(excelData.size())
                .sentEmails(sentCount)
                .failedEmails(failedEmails.size())
                .failedEmailAddresses(failedEmails)
                .build();
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(TemplateEmailResponse.builder()
                    .success(false)
                    .message("Failed to process bulk email: " + e.getMessage())
                    .build());
        }
    }
    
    @PostMapping(value = "/preview-template", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> previewTemplate(
            @RequestParam("excelFile") MultipartFile excelFile,
            @RequestParam("htmlTemplate") String htmlTemplate) {
        
        try {
            if (excelFile.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Excel file is required"));
            }
            
            List<Map<String, String>> excelData = excelProcessingService.processExcelFile(excelFile);
            if (excelData.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No data found in Excel file"));
            }
            
            Map<String, String> sampleData = excelData.get(0);
            String processedContent = templateService.processTemplate(htmlTemplate, sampleData);
            String fullHtml = templateService.wrapInHtmlTemplate(processedContent, "preview");
            
            return ResponseEntity.ok(Map.of("preview", fullHtml));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to preview template: " + e.getMessage()));
        }
    }

    @PostMapping("/bulk")
    public ResponseEntity<BulkEmailResponse> sendBulkEmails(
            @Valid @RequestBody BulkEmailRequest request,
            Authentication authentication) {

        try {
            if (request.getEmails().size() > 100) {
                return ResponseEntity.badRequest().body(
                        BulkEmailResponse.builder()
                                .success(false)
                                .message("Maximum 100 emails allowed per request")
                                .totalCount(request.getEmails().size())
                                .sentCount(0)
                                .failedEmails(List.of())
                                .build());
            }
            String username = authentication.getName();
            BulkEmailResponse response = emailService.sendBulkEmails(request, username);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Bulk email sending failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    BulkEmailResponse.builder()
                            .success(false)
                            .message("Failed to send emails: " + e.getMessage())
                            .totalCount(request.getEmails().size())
                            .sentCount(0)
                            .failedEmails(List.of())
                            .build());
        }
    }

    @PostMapping("/single")
    public ResponseEntity<String> sendSingleEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String message) {

        try {
            emailService.sendEmail(to, subject, message);
            return ResponseEntity.ok("Email sent successfully to " + to);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }
}