package com.userImp.ImplementUser.DTO.response;

import lombok.Builder;

@Builder
public class AiTemplateResponse {
    private boolean success;
    private String message;
    private String template;

    public AiTemplateResponse(boolean success, String message, String template) {
        this.success = success;
        this.message = message;
        this.template = template;
    }

    public AiTemplateResponse() {
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

}
