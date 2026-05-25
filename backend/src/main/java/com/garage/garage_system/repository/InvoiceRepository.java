package com.garage.garage_system.repository;

import com.garage.garage_system.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> { }
