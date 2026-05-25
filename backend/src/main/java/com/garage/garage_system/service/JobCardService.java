package com.garage.garage_system.service;

import com.garage.garage_system.model.JobCard;
import com.garage.garage_system.repository.JobCardRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class JobCardService {
    private final JobCardRepository repo;
    public JobCardService(JobCardRepository repo) { this.repo = repo; }
    public List<JobCard> list() { return repo.findAll(); }
    public JobCard create(JobCard j) { return repo.save(j); }
    public Optional<JobCard> get(Long id) { return repo.findById(id); }
    public JobCard update(Long id, JobCard j) { j.setId(id); return repo.save(j); }
    public void delete(Long id) { repo.deleteById(id); }
}
