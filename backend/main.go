package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	
    
	"armstrong-app/database"
    "armstrong-app/handlers"
)

func main() {
	// Connect to the database
	db := database.ConnectDB()

	// Close the database connection when the application exits
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}
	defer sqlDB.Close()

	r := mux.NewRouter()

	// User Management Routes
	r.HandleFunc("/users/register", handlers.RegisterUser(db)).Methods("POST")
	r.HandleFunc("/users/{id}", handlers.GetUser(db)).Methods("GET")

	// Armstrong Number Routes
	r.HandleFunc("/armstrong/verify", handlers.VerifyArmstrong(db)).Methods("POST")
	r.HandleFunc("/armstrong/user/{userId}", handlers.GetUserArmstrongNumbers(db)).Methods("GET")
	r.HandleFunc("/armstrong/global", handlers.GetAllUsersAndNumbers(db)).Methods("GET")

	log.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
