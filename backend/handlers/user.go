package handlers

import (
	"armstrong-app/models"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

func RegisterUser(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		user.CreatedAt = time.Now()

		// Create user in the database
		if err := db.Create(&user).Error; err != nil {
			// Check for duplicate entry error
			if mysqlErr, ok := err.(*mysql.MySQLError); ok && mysqlErr.Number == 1062 {
				http.Error(w, "Email already exists", http.StatusConflict)
				return
			}
			http.Error(w, "Error registering user", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(user)
	}
}

func LoginUser(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var input struct {
			Email string `json:"email"`
		}

		// Decode input JSON
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		// Check if the email exists in the database
		var user models.User
		if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
			http.Error(w, "User not found", http.StatusUnauthorized)
			return
		}

		// Respond with success
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
	}
}
