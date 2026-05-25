package com.garage.garage_system.service;

import com.garage.garage_system.model.JobItem;
import com.garage.garage_system.repository.JobItemRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class JobItemService {
    private final JobItemRepository repo;
    public JobItemService(JobItemRepository repo) { this.repo = repo; }
    public List<JobItem> list() { return repo.findAll(); }
    public JobItem create(JobItem j) { return repo.save(j); }
    public Optional<JobItem> get(Long id) { return repo.findById(id); }
    public JobItem update(Long id, JobItem j) { j.setId(id); return repo.save(j); }
    public void delete(Long id) { repo.deleteById(id); }
}
