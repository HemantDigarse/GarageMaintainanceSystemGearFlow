package com.garage.garage_system.service;

import com.garage.garage_system.model.Customer;
import com.garage.garage_system.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    private final CustomerRepository repo;
    public CustomerService(CustomerRepository repo) { this.repo = repo; }
    public List<Customer> list() { return repo.findAll(); }
    public Customer create(Customer c) { return repo.save(c); }
    public Optional<Customer> get(Long id) { return repo.findById(id); }
    public Customer update(Long id, Customer c) { c.setId(id); return repo.save(c); }
    public void delete(Long id) { repo.deleteById(id); }
}
