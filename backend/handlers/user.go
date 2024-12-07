package handlers

import (
	"encoding/json"
	"net/http"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"armstrong-app/models"
	"time"
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
			http.Error(w, "Error registering user", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(user)
	}
}

func GetUser(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		var user models.User

		if err := db.First(&user, id).Error; err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(user)
	}
}
