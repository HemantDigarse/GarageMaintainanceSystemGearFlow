package com.garage.garage_system.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "job_cards")
public class JobCard {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "vehicle_id")
    private Long vehicleId;

    private LocalDate createdDate;
    private String status;
    private String mechanic;
    private Double estimatedCost;

    public JobCard() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMechanic() { return mechanic; }
    public void setMechanic(String mechanic) { this.mechanic = mechanic; }
    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
}
