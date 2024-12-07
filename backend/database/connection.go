package database

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"armstrong-app/models"
)

var DB *gorm.DB

func ConnectDB() *gorm.DB {
	// Define the MySQL connection string (DSN)
	dsn := "root:Root12345@tcp(localhost:3306)/armstrong_app?charset=utf8mb4&parseTime=True&loc=Local"

	// Open the connection to the database using GORM
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}
	fmt.Println("Database connected!")

	// Automigrate the database models
	err = db.AutoMigrate(&models.User{}, &models.ArmstrongNumber{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	DB = db
	return db
}
