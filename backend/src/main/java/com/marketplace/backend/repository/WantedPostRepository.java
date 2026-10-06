package com.marketplace.backend.repository;

import com.marketplace.backend.entity.User;
import com.marketplace.backend.entity.WantedPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WantedPostRepository
        extends JpaRepository<WantedPost, Long> {

    List<WantedPost> findByUserOrderByCreatedAtDesc(User user);

    List<WantedPost> findByActiveTrueOrderByCreatedAtDesc();
}