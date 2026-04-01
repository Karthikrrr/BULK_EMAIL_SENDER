package com.userImp.ImplementUser.DTO;

import java.util.Date;
import java.util.List;

import lombok.Builder;

@Builder
public class EmailHistoryDetailDTO {
    private Long id;
    private List<String> recipients;
    private String subject;
    private String message;
    private Integer sentCount;
    private Integer totalCount;
    private List<String> failedEmails;
    private Date sentAt;
    private String status;
    private String formattedDate;

    public EmailHistoryDetailDTO(Long id, List<String> recipients, String subject, String message, Integer sentCount,
            Integer totalCount, List<String> failedEmails, Date sentAt, String status, String formattedDate) {
        this.id = id;
        this.recipients = recipients;
        this.subject = subject;
        this.message = message;
        this.sentCount = sentCount;
        this.totalCount = totalCount;
        this.failedEmails = failedEmails;
        this.sentAt = sentAt;
        this.status = status;
        this.formattedDate = formattedDate;
    }

    public EmailHistoryDetailDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<String> getRecipients() {
        return recipients;
    }

    public void setRecipients(List<String> recipients) {
        this.recipients = recipients;
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

    public Integer getSentCount() {
        return sentCount;
    }

    public void setSentCount(Integer sentCount) {
        this.sentCount = sentCount;
    }

    public Integer getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Integer totalCount) {
        this.totalCount = totalCount;
    }

    public List<String> getFailedEmails() {
        return failedEmails;
    }

    public void setFailedEmails(List<String> failedEmails) {
        this.failedEmails = failedEmails;
    }

    public Date getSentAt() {
        return sentAt;
    }

    public void setSentAt(Date sentAt) {
        this.sentAt = sentAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFormattedDate() {
        return formattedDate;
    }

    public void setFormattedDate(String formattedDate) {
        this.formattedDate = formattedDate;
    }

}
