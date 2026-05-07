package edu.iuh.fit.paymentservice.controller;

import edu.iuh.fit.paymentservice.entity.Payment;
import edu.iuh.fit.paymentservice.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Hỗ trợ gọi từ Frontend ReactJS
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> createPayment(@Valid @RequestBody Payment payment) {
        try {
            return ResponseEntity.ok(paymentService.processPayment(payment));
        } catch (Exception e) {
            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
