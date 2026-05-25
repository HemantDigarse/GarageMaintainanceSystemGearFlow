package com.garage.garage_system.service;

import com.garage.garage_system.model.Payment;
import com.garage.garage_system.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {
    private final PaymentRepository repo;
    public PaymentService(PaymentRepository repo) { this.repo = repo; }
    public List<Payment> list() { return repo.findAll(); }
    public Payment create(Payment p) { return repo.save(p); }
    public Optional<Payment> get(Long id) { return repo.findById(id); }
    public Payment update(Long id, Payment p) { p.setId(id); return repo.save(p); }
    public void delete(Long id) { repo.deleteById(id); }
}
