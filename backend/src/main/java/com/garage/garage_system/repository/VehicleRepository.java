package com.garage.garage_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.garage.garage_system.model.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}
