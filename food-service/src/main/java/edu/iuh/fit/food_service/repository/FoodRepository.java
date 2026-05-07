package edu.iuh.fit.food_service.repository;

import edu.iuh.fit.food_service.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<Food, Long> {
}
