package com.example.orderservice;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }


    // Thêm đoạn này để tạo Bean cho RestTemplate
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}


