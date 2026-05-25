package com.garage.garage_system.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.garage.garage_system.model.Vehicle;
import com.garage.garage_system.repository.VehicleRepository;

@Service
public class VehicleService {

    private final VehicleRepository repo;

    public VehicleService(VehicleRepository repo) {
        this.repo = repo;
    }

    public List<Vehicle> getAll() {
        return repo.findAll();
    }

    public Optional<Vehicle> getById(Long id) {
        return repo.findById(id);
    }

    public Vehicle create(Vehicle v) {
        if (v.getPlateNumber() == null || v.getPlateNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Plate number is required");
        }
        if (v.getBrand() == null || v.getBrand().trim().isEmpty()) {
            throw new IllegalArgumentException("Brand is required");
        }
        if (v.getModel() == null || v.getModel().trim().isEmpty()) {
            throw new IllegalArgumentException("Model is required");
        }
        if (v.getCustomerId() == null) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        return repo.save(v);
    }

    public Vehicle update(Long id, Vehicle v) {
        Vehicle existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));

        if (v.getPlateNumber() != null && !v.getPlateNumber().trim().isEmpty()) {
            existing.setPlateNumber(v.getPlateNumber());
        }
        if (v.getBrand() != null && !v.getBrand().trim().isEmpty()) {
            existing.setBrand(v.getBrand());
        }
        if (v.getModel() != null && !v.getModel().trim().isEmpty()) {
            existing.setModel(v.getModel());
        }
        if (v.getFuelType() != null) {
            existing.setFuelType(v.getFuelType());
        }
        if (v.getCustomerId() != null) {
            existing.setCustomerId(v.getCustomerId());
        }

        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
        repo.deleteById(id);
    }
}
