package com.userImp.ImplementUser.DTO.request;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;


@Builder
public class BulkEmailRequest {

    @NotEmpty(message = "At least one email is required")
    private List<@Email String> emails;

    @NotBlank(message = "Subject is Required")
    private String subject;

    @NotBlank(message = "Message is Required")
    private String message;

    public BulkEmailRequest(@NotEmpty(message = "At least one email is required") List<@Email String> emails,
            @NotBlank(message = "Subject is Required") String subject,
            @NotBlank(message = "Message is Required") String message) {
        this.emails = emails;
        this.subject = subject;
        this.message = message;
    }

    public BulkEmailRequest() {
    }

    public List<String> getEmails() {
        return emails;
    }

    public void setEmails(List<String> emails) {
        this.emails = emails;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    
}
