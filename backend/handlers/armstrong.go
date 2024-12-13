package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"armstrong-app/models"
	"armstrong-app/utils"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func VerifyArmstrong(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			UserID int `json:"user_id"`
			Number int `json:"number"`
		}
		err := json.NewDecoder(r.Body).Decode(&input)
		if err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		if input.Number <= 0 {
			http.Error(w, "Input must be a positive integer", http.StatusBadRequest)
			return
		}

		// Check if the number is an Armstrong number
		if !utils.IsArmstrongNumber(input.Number) {
			http.Error(w, "Not an Armstrong number", http.StatusBadRequest)
			return
		}

		// Save Armstrong number in the database
		armstrong := models.ArmstrongNumber{
			UserID: uint(input.UserID),
			Number: input.Number,
		}
		if err := db.Create(&armstrong).Error; err != nil {
			http.Error(w, "Error saving Armstrong number", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(armstrong)
	}
}
func GetUserArmstrongNumbers(db *gorm.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := mux.Vars(r)["userId"]

		// Parse query parameters for pagination
		pageStr := r.URL.Query().Get("page")
		sizeStr := r.URL.Query().Get("size")
		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			page = 1 // Default to page 1
		}
		size, err := strconv.Atoi(sizeStr)
		if err != nil || size < 1 {
			size = 10 // Default to 10 items per page
		}

		// Calculate offset
		offset := (page - 1) * size

		// Fetch Armstrong numbers for the user
		var armstrongNumbers []models.ArmstrongNumber
		result := db.Where("user_id = ?", userID).Offset(offset).Limit(size).Find(&armstrongNumbers)
		if result.Error != nil {
			http.Error(w, "Error fetching numbers", http.StatusInternalServerError)
			return
		}

		// Count total numbers for pagination metadata
		var total int64
		db.Model(&models.ArmstrongNumber{}).Where("user_id = ?", userID).Count(&total)

		// Create response
		response := map[string]interface{}{
			"page":       page,
			"size":       size,
			"totalPages": (total + int64(size) - 1) / int64(size), // Round up
			"totalItems": total,
			"numbers":    armstrongNumbers,
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
