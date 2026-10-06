package com.marketplace.backend.controller;

import com.marketplace.backend.entity.Campus;
import com.marketplace.backend.service.CampusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campuses")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CampusController {

    private final CampusService campusService;

    // Get all active campuses
    @GetMapping
    public List<Campus> getActiveCampuses() {
        return campusService.getActiveCampuses();
    }

    // Get a campus by ID
    @GetMapping("/{id}")
    public Campus getCampusById(@PathVariable Long id) {
        return campusService.getCampusById(id);
    }

    // Create a campus
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Campus createCampus(@RequestBody Campus campus) {
        return campusService.createCampus(campus);
    }
}
