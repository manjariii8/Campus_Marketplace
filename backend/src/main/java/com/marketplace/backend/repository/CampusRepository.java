package com.marketplace.backend.repository;

import com.marketplace.backend.entity.Campus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CampusRepository extends JpaRepository<Campus, Long> {

    Optional<Campus> findByNameIgnoreCase(String name);
}
