package com.userImp.ImplementUser.DTO.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public class BulkEmailWithTemplateRequest {
    
    @NotNull(message = "Excel file is required")
    private MultipartFile excelFile;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    @NotBlank(message = "HTML template is required")
    private String htmlTemplate;
    
    private String templateName;

    public BulkEmailWithTemplateRequest(@NotNull(message = "Excel file is required") MultipartFile excelFile,
            @NotBlank(message = "Subject is required") String subject,
            @NotBlank(message = "HTML template is required") String htmlTemplate, String templateName) {
        this.excelFile = excelFile;
        this.subject = subject;
        this.htmlTemplate = htmlTemplate;
        this.templateName = templateName;
    }

    public BulkEmailWithTemplateRequest() {
    }

    public MultipartFile getExcelFile() {
        return excelFile;
    }

    public void setExcelFile(MultipartFile excelFile) {
        this.excelFile = excelFile;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getHtmlTemplate() {
        return htmlTemplate;
    }

    public void setHtmlTemplate(String htmlTemplate) {
        this.htmlTemplate = htmlTemplate;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    
}
