package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"armstrong-app/models"
	"armstrong-app/utils"

	"gorm.io/gorm"
)

func VerifyArmstrong(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			Email  string `json:"email"`
			Number int    `json:"number"`
		}

		// Decode the input JSON
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		if input.Number <= 0 {
			http.Error(w, "Input must be a positive integer", http.StatusBadRequest)
			return
		}

		// Check if the number is an Armstrong number
		isArmstrong := utils.IsArmstrongNumber(input.Number)

		// Check if the user exists
		var user models.User
		if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
			http.Error(w, "User not found", http.StatusBadRequest)
			return
		}

		// Response payload
		response := map[string]interface{}{
			"number":      input.Number,
			"isArmstrong": isArmstrong,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func SaveArmstrongNumber(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			Email  string `json:"email"`
			Number int    `json:"number"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		// Fetch the user by email
		var user models.User
		if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
			http.Error(w, "User not found", http.StatusBadRequest)
			return
		}

		// Create the Armstrong number entry
		armstrong := models.ArmstrongNumber{
			UserID: user.ID,
			Number: input.Number,
		}
		if err := db.Create(&armstrong).Error; err != nil {
			http.Error(w, "Failed to save Armstrong number", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(armstrong)
	}
}

// Backend function for infinite scrolling
func GetUserArmstrongNumbers(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.URL.Query().Get("email")
		if email == "" {
			http.Error(w, "Email is required", http.StatusBadRequest)
			return
		}

		// Parse query parameters for pagination
		pageStr := r.URL.Query().Get("page")
		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			page = 1 // Default to page 1
		}
		size := 10 // Fixed page size

		// Calculate offset
		offset := (page - 1) * size

		// Fetch user
		var user models.User
		if err := db.Where("email = ?", email).First(&user).Error; err != nil {
			http.Error(w, "User not found", http.StatusBadRequest)
			return
		}

		// Fetch Armstrong numbers for the user
		var armstrongNumbers []models.ArmstrongNumber
		result := db.Where("user_id = ?", user.ID).Offset(offset).Limit(size).Find(&armstrongNumbers)
		if result.Error != nil {
			http.Error(w, "Error fetching numbers", http.StatusInternalServerError)
			return
		}

		// Check if there are more items
		hasMore := len(armstrongNumbers) == size

		// Create response
		response := map[string]interface{}{
			"page":    page,
			"size":    size,
			"hasMore": hasMore,
			"numbers": armstrongNumbers,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func GetAllUsersAndNumbers(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parse query parameters for pagination
		pageStr := r.URL.Query().Get("page")
		sizeStr := r.URL.Query().Get("size")
		query := r.URL.Query().Get("query") // Optional filter by email

		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			page = 1
		}
		size, err := strconv.Atoi(sizeStr)
		if err != nil || size < 1 {
			size = 10
		}

		// Calculate offset
		offset := (page - 1) * size

		// Fetch users with Armstrong numbers (using Preload)
		var users []models.User
		queryBuilder := db.Preload("Numbers")
		if query != "" {
			queryBuilder = queryBuilder.Where("email LIKE ?", "%"+query+"%")
		}
		result := queryBuilder.Offset(offset).Limit(size).Find(&users)
		if result.Error != nil {
			http.Error(w, "Error fetching users", http.StatusInternalServerError)
			return
		}

		// Count total users for pagination metadata
		var total int64
		db.Model(&models.User{}).Where("email LIKE ?", "%"+query+"%").Count(&total)

		// Create response
		response := map[string]interface{}{
			"page":       page,
			"size":       size,
			"totalPages": (total + int64(size) - 1) / int64(size), // Round up
			"totalItems": total,
			"data":       users,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
