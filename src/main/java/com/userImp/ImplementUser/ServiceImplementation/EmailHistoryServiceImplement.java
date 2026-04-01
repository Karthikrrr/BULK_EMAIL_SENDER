package com.userImp.ImplementUser.ServiceImplementation;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.userImp.ImplementUser.DTO.EmailHistoryDTO;
import com.userImp.ImplementUser.DTO.EmailHistoryDetailDTO;
import com.userImp.ImplementUser.Entity.EmailHistory;
import com.userImp.ImplementUser.Entity.User;
import com.userImp.ImplementUser.Repository.EmailHistoryRepository;
import com.userImp.ImplementUser.Repository.UserRepository;
import com.userImp.ImplementUser.Services.EmailHistoryServices;

@Service
public class EmailHistoryServiceImplement implements EmailHistoryServices {
    private final EmailHistoryRepository emailHistoryRepository;
    private final UserRepository userRepository;

    public EmailHistoryServiceImplement(EmailHistoryRepository emailHistoryRepository, UserRepository userRepository) {
        this.emailHistoryRepository = emailHistoryRepository;
        this.userRepository = userRepository;
    }

    public List<EmailHistoryDTO> getUserEmailHistory(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<EmailHistory> histories = emailHistoryRepository.findByUserOrderBySentAtDesc(user);

        return histories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Page<EmailHistoryDTO> getUserEmailHistoryPaginated(String username, int page, int size) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Page<EmailHistory> histories = emailHistoryRepository.findByUserOrderBySentAtDesc(
                user, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "sentAt")));

        return histories.map(this::convertToDTO);
    }

    public EmailHistoryDetailDTO getEmailHistoryDetail(Long historyId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EmailHistory history = emailHistoryRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("Email history not found"));

        // Security check - user can only access their own history
        if (!history.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return convertToDetailDTO(history);
    }

    private EmailHistoryDTO convertToDTO(EmailHistory history) {
        String messagePreview = history.getMessage().length() > 100
                ? history.getMessage().substring(0, 100) + "..."
                : history.getMessage();

        return EmailHistoryDTO.builder()
                .id(history.getId())
                .sentTo(history.getSentTo())
                .subject(history.getSubject())
                .messagePreview(messagePreview)
                .sentCount(history.getSentCount())
                .totalCount(history.getTotalCount())
                .failedEmails(history.getFailedEmails())
                .sentAt(history.getSentAt())
                .status(history.getStatus().name())
                .formattedDate(formatDate(history.getSentAt()))
                .build();
    }

    private EmailHistoryDetailDTO convertToDetailDTO(EmailHistory history) {
        List<String> recipients = Arrays.asList(history.getSentTo().split(","));
        List<String> failedEmails = history.getFailedEmails() != null
                ? Arrays.asList(history.getFailedEmails().split(","))
                : Collections.emptyList();

        return EmailHistoryDetailDTO.builder()
                .id(history.getId())
                .recipients(recipients)
                .subject(history.getSubject())
                .message(history.getMessage())
                .sentCount(history.getSentCount())
                .totalCount(history.getTotalCount())
                .failedEmails(failedEmails)
                .sentAt(history.getSentAt())
                .status(history.getStatus().name())
                .formattedDate(formatDate(history.getSentAt()))
                .build();
    }

    private String formatDate(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, yyyy HH:mm");
        return sdf.format(date);
    }
}
