package com.garage.garage_system.controller;

import com.garage.garage_system.model.JobItem;
import com.garage.garage_system.service.JobItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/jobitems")
@CrossOrigin(origins = "http://localhost:5173")
public class JobItemController {
    private final JobItemService service;
    public JobItemController(JobItemService service) { this.service = service; }

    @GetMapping
    public List<JobItem> list() { return service.list(); }

    @PostMapping
    public ResponseEntity<JobItem> create(@RequestBody JobItem j) {
        JobItem saved = service.create(j);
        return ResponseEntity.created(URI.create("/api/jobitems/" + saved.getId())).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobItem> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobItem> update(@PathVariable Long id, @RequestBody JobItem j) {
        return ResponseEntity.ok(service.update(id, j));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
