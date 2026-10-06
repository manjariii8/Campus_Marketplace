package com.marketplace.backend.service;

import com.marketplace.backend.entity.Campus;

import java.util.List;

public interface CampusService {

    List<Campus> getActiveCampuses();

    Campus getCampusById(Long id);

    Campus createCampus(Campus campus);
}
