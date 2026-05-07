package edu.iuh.fit.food_service.controller;

import edu.iuh.fit.food_service.entity.Food;
import edu.iuh.fit.food_service.service.FoodService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @GetMapping
    public List<Food> getAll() {
        return foodService.getAllFoods();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Food> getById(@PathVariable Long id) {
        Food food = foodService.getFoodById(id);
        if (food != null) {
            return ResponseEntity.ok(food);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Food> create(@Valid @RequestBody Food food) {
        Food savedFood = foodService.saveFood(food); // [cite: 55]
        return new ResponseEntity<>(savedFood, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Food> update(@PathVariable Long id, @Valid @RequestBody Food food) {
        if (foodService.getFoodById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        food.setId(id);
        return ResponseEntity.ok(foodService.saveFood(food));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (foodService.getFoodById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        foodService.deleteFood(id);
        return ResponseEntity.noContent().build();
    }
}