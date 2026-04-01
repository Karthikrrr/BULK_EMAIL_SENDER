package com.userImp.ImplementUser.DTO.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;


@Builder
public class AiTemplateRequest {
    @NotBlank(message = "Prompt is required")
    private String prompt;

    private String tone;
    private String purpose;

    public AiTemplateRequest(@NotBlank(message = "Prompt is required") String prompt, String tone, String purpose) {
        this.prompt = prompt;
        this.tone = tone;
        this.purpose = purpose;
    }

    public AiTemplateRequest() {
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

}
