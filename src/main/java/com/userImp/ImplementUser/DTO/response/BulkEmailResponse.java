package com.userImp.ImplementUser.DTO.response;

import java.util.List;

import lombok.Builder;

@Builder
public class BulkEmailResponse {
    private boolean success;
    private String message;
    private int totalCount;
    private int sentCount;
    private List<String> failedEmails;
    private Long historyId;

    public BulkEmailResponse(boolean success, String message, int totalCount, int sentCount, List<String> failedEmails,
            Long historyId) {
        this.success = success;
        this.message = message;
        this.totalCount = totalCount;
        this.sentCount = sentCount;
        this.failedEmails = failedEmails;
        this.historyId = historyId;
    }

    public BulkEmailResponse() {
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

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public int getSentCount() {
        return sentCount;
    }

    public void setSentCount(int sentCount) {
        this.sentCount = sentCount;
    }

    public List<String> getFailedEmails() {
        return failedEmails;
    }

    public void setFailedEmails(List<String> failedEmails) {
        this.failedEmails = failedEmails;
    }

    public Long getHistoryId() {
        return historyId;
    }

    public void setHistoryId(Long historyId) {
        this.historyId = historyId;
    }

}
