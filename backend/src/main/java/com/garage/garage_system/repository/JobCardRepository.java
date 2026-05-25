package com.garage.garage_system.repository;

import com.garage.garage_system.model.JobCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobCardRepository extends JpaRepository<JobCard, Long> { }
