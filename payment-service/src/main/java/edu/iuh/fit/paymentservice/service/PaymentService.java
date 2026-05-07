package edu.iuh.fit.paymentservice.service;

import edu.iuh.fit.paymentservice.controller.NotificationController;
import edu.iuh.fit.paymentservice.entity.Payment;
import edu.iuh.fit.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;

    // Khởi tạo RestTemplate để gọi sang Order Service [cite: 73]
    private final RestTemplate restTemplate = new RestTemplate();
    private final NotificationController notificationController;

    @Value("${order.service.url}")
    private String orderServiceUrl;

    public Payment processPayment(Payment payment) {

        // --- BƯỚC KIỂM TRA: Validate OrderID tồn tại ---
        try {
            // Gọi GET /orders/{id} sang Order Service để check tồn tại [cite: 65, 67]
            ResponseEntity<Object> response = restTemplate.getForEntity(
                    orderServiceUrl + "/" + payment.getOrderId(), Object.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Đơn hàng không tồn tại, không thể thanh toán!");
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xác thực đơn hàng: " + e.getMessage());
        }

        // 1. Giả lập xử lý thanh toán và lưu vào MariaDB
        payment.setStatus("SUCCESS");
        Payment savedPayment = paymentRepository.save(payment);

        // 2. Update trạng thái order (gọi Order Service) [cite: 73]
        // URL dự kiến: http://172.16.33.165:8083/orders/{id}/status?status=PAID
        try {
            String updateStatusUrl = orderServiceUrl + "/" + payment.getOrderId() + "/status?status=PAID";
            restTemplate.put(updateStatusUrl, null);
            System.out.println("DEBUG: Da goi Order Service de cap nhat trang thai.");
        } catch (Exception e) {
            // Log lỗi nếu Order Service (Người 4) chưa chạy hoặc sai IP [cite: 88, 92]
            System.err.println("Lỗi khi kết nối Order Service: " + e.getMessage());
        }

        // 3. Gửi notification (Log console đúng định dạng yêu cầu) [cite: 74, 75, 76]
        // Lưu ý: "User A" có thể fix cứng hoặc lấy từ thông tin User Service nếu có truyền sang
        System.out.println("************************************************************");
        System.out.println("User A đã đặt đơn #" + payment.getOrderId() + " thành công");
        System.out.println("************************************************************    ");

        // Gửi thông báo tới Frontend đang kết nối qua mạng LAN
        String msg = "User A đã đặt đơn #" + payment.getOrderId() + " thành công";
        notificationController.broadcast(msg);

        System.out.println(msg);

        return savedPayment;
    }
}
