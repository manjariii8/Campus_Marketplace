package com.marketplace.backend.service.impl;

import com.marketplace.backend.entity.Campus;
import com.marketplace.backend.exception.ResourceNotFoundException;
import com.marketplace.backend.repository.CampusRepository;
import com.marketplace.backend.service.CampusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampusServiceImpl implements CampusService {

    private final CampusRepository campusRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Campus> getActiveCampuses() {
        return campusRepository.findAll()
                .stream()
                .filter(Campus::getActive)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Campus getCampusById(Long id) {
        return campusRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Campus not found"));
    }

    @Override
    @Transactional
    public Campus createCampus(Campus campus) {
        return campusRepository.save(campus);
    }
}
