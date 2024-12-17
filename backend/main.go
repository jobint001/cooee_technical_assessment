package main

import (
	"log"
	"net/http"

	"armstrong-app/database"
	"armstrong-app/handlers"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
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
	r.HandleFunc("/armstrong/save", handlers.SaveArmstrongNumber(db)).Methods("POST")

	r.HandleFunc("/user-dashboard", handlers.GetUserArmstrongNumbers(db)).Methods("GET")
	r.HandleFunc("/armstrong/global", handlers.GetAllUsersAndNumbers(db)).Methods("GET")
	r.HandleFunc("/users/login", handlers.LoginUser(db)).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Only allow your frontend's origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true, // Allow cookies and Authorization headers
	})

	// Wrap the router with the CORS middleware
	handler := c.Handler(r)

	log.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
