package handlers

import (
	"encoding/json"
	"net/http"
	

	"gorm.io/gorm"
	"github.com/gorilla/mux"
	"armstrong-app/models"
	"armstrong-app/utils"
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

func GetUserArmstrongNumbers(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userId := mux.Vars(r)["userId"]
		var armstrongNumbers []models.ArmstrongNumber

		if err := db.Where("user_id = ?", userId).Find(&armstrongNumbers).Error; err != nil {
			http.Error(w, "Error retrieving Armstrong numbers", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(armstrongNumbers)
	}
}

func GetAllUsersAndNumbers(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var users []models.User
		if err := db.Find(&users).Error; err != nil {
			http.Error(w, "Error retrieving users", http.StatusInternalServerError)
			return
		}

		var result []struct {
			User          models.User           `json:"user"`
			ArmstrongNumbers []models.ArmstrongNumber `json:"armstrong_numbers"`
		}

		for _, user := range users {
			var armstrongNumbers []models.ArmstrongNumber
			db.Where("user_id = ?", user.ID).Find(&armstrongNumbers)

			result = append(result, struct {
				User           models.User           `json:"user"`
				ArmstrongNumbers []models.ArmstrongNumber `json:"armstrong_numbers"`
			}{
				User: user,
				ArmstrongNumbers: armstrongNumbers,
			})
		}

		json.NewEncoder(w).Encode(result)
	}
}
