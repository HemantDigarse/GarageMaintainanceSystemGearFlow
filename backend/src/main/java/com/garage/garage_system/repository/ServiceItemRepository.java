package com.garage.garage_system.repository;

import com.garage.garage_system.model.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> { }
