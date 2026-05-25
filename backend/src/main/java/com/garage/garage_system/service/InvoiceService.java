package com.garage.garage_system.service;

import com.garage.garage_system.model.Invoice;
import com.garage.garage_system.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {
    private final InvoiceRepository repo;
    public InvoiceService(InvoiceRepository repo) { this.repo = repo; }
    
    public List<Invoice> list() { return repo.findAll(); }
    
    public Invoice create(Invoice i) {
        // Auto-generate invoiceId: INV-2025-001
        if (i.getInvoiceId() == null || i.getInvoiceId().isEmpty()) {
            int year = Year.now().getValue();
            long count = repo.count() + 1;
            i.setInvoiceId(String.format("INV-%d-%03d", year, count));
        }
        return repo.save(i);
    }
    
    public Optional<Invoice> get(Long id) { return repo.findById(id); }
    
    public Invoice update(Long id, Invoice i) {
        Invoice existing = repo.findById(id).orElseThrow();
        
        // Only update fields that are provided (not null)
        if (i.getStatus() != null) existing.setStatus(i.getStatus());
        if (i.getCustomerId() != null) existing.setCustomerId(i.getCustomerId());
        if (i.getVehicleId() != null) existing.setVehicleId(i.getVehicleId());
        if (i.getServices() != null) existing.setServices(i.getServices());
        if (i.getTotalAmount() != null) existing.setTotalAmount(i.getTotalAmount());
        if (i.getInvoiceDate() != null) existing.setInvoiceDate(i.getInvoiceDate());
        
        return repo.save(existing);
    }
    
    public void delete(Long id) { repo.deleteById(id); }
}
