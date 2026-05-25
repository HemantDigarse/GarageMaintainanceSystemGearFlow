package com.garage.garage_system.controller;

import com.garage.garage_system.model.ServiceItem;
import com.garage.garage_system.service.ServiceItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceItemController {
    private final ServiceItemService service;
    public ServiceItemController(ServiceItemService service) { this.service = service; }

    @GetMapping
    public List<ServiceItem> list() { return service.list(); }

    @PostMapping
    public ResponseEntity<ServiceItem> create(@RequestBody ServiceItem s) {
        ServiceItem saved = service.create(s);
        return ResponseEntity.created(URI.create("/api/services/" + saved.getId())).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceItem> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceItem> update(@PathVariable Long id, @RequestBody ServiceItem s) {
        return ResponseEntity.ok(service.update(id, s));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
