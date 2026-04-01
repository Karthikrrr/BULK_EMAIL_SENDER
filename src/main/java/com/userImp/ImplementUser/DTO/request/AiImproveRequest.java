package com.userImp.ImplementUser.DTO.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public class AiImproveRequest {
    @NotBlank(message = "Existing template is required")
    private String existingTemplate;

    @NotBlank(message = "Improvement prompt is required")
    private String improvementPrompt;

    public AiImproveRequest(@NotBlank(message = "Existing template is required") String existingTemplate,
            @NotBlank(message = "Improvement prompt is required") String improvementPrompt) {
        this.existingTemplate = existingTemplate;
        this.improvementPrompt = improvementPrompt;
    }

    public AiImproveRequest() {
    }

    public String getExistingTemplate() {
        return existingTemplate;
    }

    public void setExistingTemplate(String existingTemplate) {
        this.existingTemplate = existingTemplate;
    }

    public String getImprovementPrompt() {
        return improvementPrompt;
    }

    public void setImprovementPrompt(String improvementPrompt) {
        this.improvementPrompt = improvementPrompt;
    }

}
