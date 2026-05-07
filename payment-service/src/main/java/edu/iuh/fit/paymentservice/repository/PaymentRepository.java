package edu.iuh.fit.paymentservice.repository;

import edu.iuh.fit.paymentservice.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
