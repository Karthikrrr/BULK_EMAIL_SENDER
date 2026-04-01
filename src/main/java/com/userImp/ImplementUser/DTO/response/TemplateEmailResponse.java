package com.userImp.ImplementUser.DTO.response;

import java.util.List;
import java.util.Map;

import lombok.Builder;


@Builder
public class TemplateEmailResponse {
    private boolean success;
    private String message;
    private int totalEmails;
    private int sentEmails;
    private int failedEmails;
    private List<String> failedEmailAddresses;
    private List<Map<String, String>> sampleData;

    
    public TemplateEmailResponse(boolean success, String message, int totalEmails, int sentEmails, int failedEmails,
            List<String> failedEmailAddresses, List<Map<String, String>> sampleData) {
        this.success = success;
        this.message = message;
        this.totalEmails = totalEmails;
        this.sentEmails = sentEmails;
        this.failedEmails = failedEmails;
        this.failedEmailAddresses = failedEmailAddresses;
        this.sampleData = sampleData;
    }
    public TemplateEmailResponse() {
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
    public int getTotalEmails() {
        return totalEmails;
    }
    public void setTotalEmails(int totalEmails) {
        this.totalEmails = totalEmails;
    }
    public int getSentEmails() {
        return sentEmails;
    }
    public void setSentEmails(int sentEmails) {
        this.sentEmails = sentEmails;
    }
    public int getFailedEmails() {
        return failedEmails;
    }
    public void setFailedEmails(int failedEmails) {
        this.failedEmails = failedEmails;
    }
    public List<String> getFailedEmailAddresses() {
        return failedEmailAddresses;
    }
    public void setFailedEmailAddresses(List<String> failedEmailAddresses) {
        this.failedEmailAddresses = failedEmailAddresses;
    }
    public List<Map<String, String>> getSampleData() {
        return sampleData;
    }
    public void setSampleData(List<Map<String, String>> sampleData) {
        this.sampleData = sampleData;
    }


    
}