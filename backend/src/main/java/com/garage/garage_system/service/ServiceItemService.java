package com.garage.garage_system.service;

import com.garage.garage_system.model.ServiceItem;
import com.garage.garage_system.repository.ServiceItemRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceItemService {
    private final ServiceItemRepository repo;
    public ServiceItemService(ServiceItemRepository repo) { this.repo = repo; }
    public List<ServiceItem> list() { return repo.findAll(); }
    public ServiceItem create(ServiceItem s) { return repo.save(s); }
    public Optional<ServiceItem> get(Long id) { return repo.findById(id); }
    public ServiceItem update(Long id, ServiceItem s) { s.setId(id); return repo.save(s); }
    public void delete(Long id) { repo.deleteById(id); }
}
