package com.garage.garage_system.repository;

import com.garage.garage_system.model.JobItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobItemRepository extends JpaRepository<JobItem, Long> { }
