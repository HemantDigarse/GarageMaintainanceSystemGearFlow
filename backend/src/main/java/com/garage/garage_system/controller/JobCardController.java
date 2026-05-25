package com.garage.garage_system.controller;

import com.garage.garage_system.model.JobCard;
import com.garage.garage_system.service.JobCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/jobcards")
@CrossOrigin(origins = "http://localhost:5173")
public class JobCardController {
    private final JobCardService service;
    public JobCardController(JobCardService service) { this.service = service; }

    @GetMapping
    public List<JobCard> list() { return service.list(); }

    @PostMapping
    public ResponseEntity<JobCard> create(@RequestBody JobCard j) {
        JobCard saved = service.create(j);
        return ResponseEntity.created(URI.create("/api/jobcards/" + saved.getId())).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobCard> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobCard> update(@PathVariable Long id, @RequestBody JobCard j) {
        return ResponseEntity.ok(service.update(id, j));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
