package edu.iuh.fit.food_service;

import edu.iuh.fit.food_service.entity.Food;
import edu.iuh.fit.food_service.repository.FoodRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FoodServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(FoodRepository repository) {
		return args -> {
			if (repository.count() == 0) {
				repository.save(new Food(null, "Cơm Tấm", 35000.0, "Cơm tấm sườn bì chả", "https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/174626/Originals/cach%20lam%20com%20tam_hinh%201.jpg"));
				repository.save(new Food(null, "Bún Bò Huế", 45000.0, "Bún bò gốc Huế", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT55CWfET_VNKcsSQOdJ9ZwCLXeUVKMWGeE7A&s"));
				repository.save(new Food(null, "Trà Sữa", 25000.0, "Trà sữa trân châu đường đen", "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQLm2s9qj_iJBY1oB40KcMtzmePajj4G2x2cIowQSy1H7fwowMsFdcwIF4Rizn0q_Q65YuBklkIQ12Gdokjrd-Eem5Im8Reyl2AkZHXQfiBE2Yp_agbN4T8kqzIafzsGO-4W-6dAVpc&usqp=CAc"));
				System.out.println(">>> Food Service đã sẵn sàng và đã seed dữ liệu!");
			}
		};
	}
}