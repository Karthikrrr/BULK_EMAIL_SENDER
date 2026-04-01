package com.userImp.ImplementUser.Services;

import java.util.List;

import org.springframework.data.domain.Page;

import com.userImp.ImplementUser.DTO.EmailHistoryDTO;
import com.userImp.ImplementUser.DTO.EmailHistoryDetailDTO;

public interface EmailHistoryServices {
    List<EmailHistoryDTO> getUserEmailHistory(String username);
    Page<EmailHistoryDTO> getUserEmailHistoryPaginated(String username, int page, int size);
    EmailHistoryDetailDTO getEmailHistoryDetail(Long historyId, String username);
}
