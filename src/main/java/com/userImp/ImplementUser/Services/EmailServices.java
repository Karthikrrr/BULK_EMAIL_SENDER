package com.userImp.ImplementUser.Services;

import com.userImp.ImplementUser.DTO.request.BulkEmailRequest;
import com.userImp.ImplementUser.DTO.response.BulkEmailResponse;

import jakarta.mail.MessagingException;


public interface EmailServices {

    BulkEmailResponse sendBulkEmails(BulkEmailRequest request, String username);
    void sendEmail(String to, String subject, String message) throws MessagingException;
}
