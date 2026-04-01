package com.userImp.ImplementUser.ServiceImplementation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.userImp.ImplementUser.DTO.request.BulkEmailRequest;
import com.userImp.ImplementUser.DTO.response.BulkEmailResponse;
import com.userImp.ImplementUser.Entity.EmailHistory;
import com.userImp.ImplementUser.Entity.Status;
import com.userImp.ImplementUser.Entity.User;
import com.userImp.ImplementUser.Repository.EmailHistoryRepository;
import com.userImp.ImplementUser.Repository.UserRepository;
import com.userImp.ImplementUser.Services.EmailServices;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailServiceImplement implements EmailServices {

    private final JavaMailSender mailSender;
    private final EmailHistoryRepository emailHistoryRepository;
    private final UserRepository userRepository;

    public EmailServiceImplement(JavaMailSender mailSender, EmailHistoryRepository emailHistoryRepository,
            UserRepository userRepository) {
        this.mailSender = mailSender;
        this.emailHistoryRepository = emailHistoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public BulkEmailResponse sendBulkEmails(BulkEmailRequest request, String username) {
        log.info("Starting bulk email send for user: {}", username);
        
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> {
                    log.error("User not found with email: {}", username);
                    return new RuntimeException("User not found");
                });

        log.info("Found user: {} (ID: {})", user.getEmail(), user.getId());

        List<String> failedEmails = new ArrayList<>();
        int sentCount = 0;

        for (String email : request.getEmails()) {
            try {
                log.info("Attempting to send email to: {}", email);
                sendEmail(email, request.getSubject(), request.getMessage());
                sentCount++;
                log.info("Successfully sent email to: {}", email);
                
                Thread.sleep(100);
            } catch (Exception e) {
                log.error("Failed to send email to {}: {}", email, e.getMessage());
                failedEmails.add(email);
            }
        }

        log.info("Email sending completed. Sent: {}, Failed: {}", sentCount, failedEmails.size());

        // Save email history
        Status status;
        if (sentCount == request.getEmails().size()) {
            status = Status.SUCCESS;
        } else if (sentCount > 0) {
            status = Status.PARTIAL_SUCCESS;
        } else {
            status = Status.FAILED;
        }

        log.info("Saving email history with status: {}", status);

        EmailHistory emailHistory = new EmailHistory();
        emailHistory.setUser(user);
        emailHistory.setSentTo(String.join(",", request.getEmails()));
        emailHistory.setSubject(request.getSubject());
        emailHistory.setMessage(request.getMessage());
        emailHistory.setSentCount(sentCount);
        emailHistory.setTotalCount(request.getEmails().size());
        emailHistory.setFailedEmails(failedEmails.isEmpty() ? null : String.join(",", failedEmails));
        emailHistory.setStatus(status);

        try {
            EmailHistory savedHistory = emailHistoryRepository.save(emailHistory);
            log.info("EmailHistory saved successfully with ID: {}", savedHistory.getId());

            BulkEmailResponse response = new BulkEmailResponse();
            response.setSuccess(sentCount > 0);
            response.setMessage(sentCount + " emails sent successfully, " + failedEmails.size() + " failed");
            response.setTotalCount(request.getEmails().size());
            response.setSentCount(sentCount);
            response.setFailedEmails(failedEmails);
            response.setHistoryId(savedHistory.getId());

            return response;
        } catch (Exception e) {
            log.error("Failed to save email history: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save email history: " + e.getMessage());
        }
    }

    public void sendEmail(String to, String subject, String message) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(message, true);

        mailSender.send(mimeMessage);
        log.info("Email sent successfully to: {}", to);
    }
}