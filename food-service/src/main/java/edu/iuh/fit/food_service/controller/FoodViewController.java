package edu.iuh.fit.food_service.controller;

import edu.iuh.fit.food_service.entity.Food;
import edu.iuh.fit.food_service.service.FoodService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/foods")
public class FoodViewController {

    @Autowired
    private FoodService foodService;

    @GetMapping
    public String listFoods(Model model) {
        model.addAttribute("foods", foodService.getAllFoods());
        return "food-list";
    }

    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("food", new Food());
        return "food-form";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        Food food = foodService.getFoodById(id);
        model.addAttribute("food", food);
        return "food-form";
    }

    @PostMapping("/save")
    public String saveFood(@Valid @ModelAttribute("food") Food food, BindingResult result) {
        if (result.hasErrors()) {
            return "food-form"; // Nếu có lỗi, quay lại form để người dùng sửa
        }
        foodService.saveFood(food);
        return "redirect:/admin/foods";
    }

    @GetMapping("/delete/{id}")
    public String deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return "redirect:/admin/foods";
    }
}