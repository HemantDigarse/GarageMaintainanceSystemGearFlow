package com.garage.garage_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.garage.garage_system.dto.LoginRequest;
import com.garage.garage_system.dto.LoginResponse;
import com.garage.garage_system.dto.SignupRequest;
import com.garage.garage_system.model.User;
import com.garage.garage_system.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final UserService userService;
    public AuthController(UserService userService) { this.userService = userService; }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userService.findByEmail(request.getEmail())
                .map(user -> {
                    if (user.getPassword().equals(request.getPassword())) {
                        LoginResponse response = new LoginResponse(
                            "LOGIN_SUCCESS",
                            user.getName(),
                            user.getEmail(),
                            user.getRole()
                        );
                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.status(401).body("INVALID_PASSWORD");
                    }
                })
                .orElse(ResponseEntity.status(401).body("INVALID_EMAIL"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        // Check if email already exists
        if (userService.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(409).body("EMAIL_ALREADY_EXISTS");
        }

        // Validate role
        String role = request.getRole();
        if (role == null || (!role.equals("ADMIN") && !role.equals("GARAGE_OWNER"))) {
            return ResponseEntity.status(400).body("INVALID_ROLE");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        userService.save(user);

        LoginResponse response = new LoginResponse(
            "SIGNUP_SUCCESS",
            user.getName(),
            user.getEmail(),
            user.getRole()
        );
        return ResponseEntity.ok(response);
    }
}
