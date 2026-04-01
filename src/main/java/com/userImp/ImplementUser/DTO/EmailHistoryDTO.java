package com.userImp.ImplementUser.DTO;

import java.util.Date;

import lombok.Builder;

@Builder
public class EmailHistoryDTO {
    private Long id;
    private String sentTo;
    private String subject;
    private String messagePreview;
    private Integer sentCount;
    private Integer totalCount;
    private String failedEmails;
    private Date sentAt;
    private String status;
    private String formattedDate;

    public EmailHistoryDTO(Long id, String sentTo, String subject, String messagePreview, Integer sentCount,
            Integer totalCount, String failedEmails, Date sentAt, String status, String formattedDate) {
        this.id = id;
        this.sentTo = sentTo;
        this.subject = subject;
        this.messagePreview = messagePreview;
        this.sentCount = sentCount;
        this.totalCount = totalCount;
        this.failedEmails = failedEmails;
        this.sentAt = sentAt;
        this.status = status;
        this.formattedDate = formattedDate;
    }

    public EmailHistoryDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSentTo() {
        return sentTo;
    }

    public void setSentTo(String sentTo) {
        this.sentTo = sentTo;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessagePreview() {
        return messagePreview;
    }

    public void setMessagePreview(String messagePreview) {
        this.messagePreview = messagePreview;
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

    public String getFailedEmails() {
        return failedEmails;
    }

    public void setFailedEmails(String failedEmails) {
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
