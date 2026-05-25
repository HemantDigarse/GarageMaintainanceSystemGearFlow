package com.garage.garage_system.controller;

import com.garage.garage_system.model.Invoice;
import com.garage.garage_system.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {
    private final InvoiceService service;
    public InvoiceController(InvoiceService service) { this.service = service; }

    @GetMapping
    public List<Invoice> list() { return service.list(); }

    @PostMapping
    public ResponseEntity<Invoice> create(@RequestBody Invoice i) {
        Invoice saved = service.create(i);
        return ResponseEntity.created(URI.create("/api/invoices/" + saved.getId())).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invoice> update(@PathVariable Long id, @RequestBody Invoice i) {
        return ResponseEntity.ok(service.update(id, i));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
