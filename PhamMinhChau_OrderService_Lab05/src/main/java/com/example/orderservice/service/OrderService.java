package com.example.orderservice.service;

import com.example.orderservice.dto.OrderRequest;
import com.example.orderservice.entity.Order;
import com.example.orderservice.entity.OrderItem;
import com.example.orderservice.repository.OrderRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    // Cấu hình URL từ localhost (hoặc IP máy bạn)
    private final String USER_SERVICE_URL = "http://localhost:8081/users/";
    private final String FOOD_SERVICE_URL = "http://localhost:8082/foods/";



    @Transactional
    @CircuitBreaker(name = "orderServiceCB", fallbackMethod = "orderServiceCBFallback")
    @Retry(name = "orderServiceRetry")
    @RateLimiter(name = "orderService")
    public Order createOrder(OrderRequest request) {
        System.out.println("Chạy lại");
        // 1. Gọi User Service để validate user
        if (request.getUserId() == null) {
            throw new RuntimeException("UserID không được để trống! Vui lòng đăng nhập lại.");
        }

        try {
            String userUrl = USER_SERVICE_URL + request.getUserId();
            Object userStatus = restTemplate.getForObject(userUrl, Object.class);
            if (userStatus == null) throw new RuntimeException("User không tồn tại!");
        } catch (Exception e) {
            throw new RuntimeException("Không thể kết nối tới User Service tại " + USER_SERVICE_URL);
        }
        System.out.println("Bypass User Service cho User ID: " + request.getUserId());

        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setStatus("PENDING");
        // Nên set thêm ngày tạo để tránh null ở DB
        order.setCreatedAt(java.time.LocalDateTime.now());

        List<OrderItem> details = request.getItems().stream().map(itemReq -> {
            String foodUrl = FOOD_SERVICE_URL + itemReq.getFoodId();

            Map<String, Object> foodInfo;
            try {
                // Gọi Food Service
                foodInfo = restTemplate.getForObject(foodUrl, Map.class);
            }catch (ResourceAccessException e) {
                // Ném lại đúng loại ResourceAccessException để Retry bắt được
                throw e;
            } catch (Exception e) {
                throw new RuntimeException("Lỗi không xác định: " + e.getMessage());
            }
            // KIỂM TRA ID TỒN TẠI TẠI ĐÂY
            if (foodInfo == null || foodInfo.isEmpty()) {
                // Message này sẽ được GlobalExceptionHandler bắt và trả về Postman
                throw new RuntimeException("Food ID không tồn tại!");
            }

            // Lấy giá an toàn (tránh lỗi ép kiểu nếu giá là số nguyên)
            Double currentPrice = Double.valueOf(foodInfo.get("price").toString());

            OrderItem detail = new OrderItem();
            detail.setFoodId(itemReq.getFoodId());
            detail.setQuantity(itemReq.getQuantity());
            detail.setPrice(currentPrice);
            detail.setOrders(order);
            return detail;
        }).collect(Collectors.toList());

        order.setItems(details);
        order.setTotalPrice(details.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum());

        return orderRepository.save(order);
    }

    // Hàm Fallback cho Circuit Breaker
    // PHẢI: Trùng tên, cùng tham số đầu vào, thêm tham số Throwable, cùng kiểu trả về (Order)
    public Order orderServiceCBFallback(OrderRequest request, Throwable t) {
        System.err.println("--- LOG FALLBACK ---");
        System.err.println("Dịch vụ đang gặp sự cố: " + t.getMessage());

        // Tạo một Order rỗng hoặc Order báo lỗi để trả về thay vì để crash hệ thống
        Order errorOrder = new Order();
        errorOrder.setStatus("FAILED_BY_RESILIENCE");

        // Bạn có thể quăng ra một lỗi tùy chỉnh hoặc trả về object rỗng tùy bài Lab yêu cầu
        return errorOrder;
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        // 1. Tìm đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + orderId));

        // 2. Cập nhật trạng thái (ví dụ từ PENDING sang PAID)
        order.setStatus(status);

        // 3. Lưu lại vào DB
        orderRepository.save(order);

        // In log để demo cho thấy kết nối liên thông
        System.out.println(">>> [ORDER-SERVICE] Đã cập nhật đơn hàng #" + orderId + " sang trạng thái: " + status);
    }


}
