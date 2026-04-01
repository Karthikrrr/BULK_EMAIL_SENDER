package com.userImp.ImplementUser.Entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "email_history")
public class EmailHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "sent_to", nullable = false)
    private String sentTo; 

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "sent_count", nullable = false)
    private Integer sentCount;

    @Column(name = "total_count", nullable = false)
    private Integer totalCount;

    @Column(name = "failed_emails", columnDefinition = "TEXT")
    private String failedEmails;
    
    @Column(name = "sent_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date sentAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public EmailHistory(Long id, User user, String sentTo, String subject, String message, Integer sentCount,
            Integer totalCount, String failedEmails, Date sentAt, Status status) {
        this.id = id;
        this.user = user;
        this.sentTo = sentTo;
        this.subject = subject;
        this.message = message;
        this.sentCount = sentCount;
        this.totalCount = totalCount;
        this.failedEmails = failedEmails;
        this.sentAt = sentAt;
        this.status = status;
    }

    public EmailHistory() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        sentAt = new Date();
    }
}