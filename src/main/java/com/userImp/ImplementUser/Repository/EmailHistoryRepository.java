package com.userImp.ImplementUser.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.userImp.ImplementUser.Entity.EmailHistory;
import com.userImp.ImplementUser.Entity.Status;
import com.userImp.ImplementUser.Entity.User;

public interface EmailHistoryRepository extends JpaRepository<EmailHistory, Long> {

    List<EmailHistory> findByUserOrderBySentAtDesc(User user);

    List<EmailHistory> findByUserAndStatusOrderBySentAtDesc(User user, Status status);

    Page<EmailHistory> findByUserOrderBySentAtDesc(User user, Pageable pageable);

    @Query("SELECT COUNT(eh) FROM EmailHistory eh WHERE eh.user = :user")
    Long countByUser(@Param("user") User user);

}
