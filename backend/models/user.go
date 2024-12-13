package models

import "time"

type User struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	Email     string    `json:"email" gorm:"unique"`
	CreatedAt time.Time `json:"created_at"`

	Numbers []ArmstrongNumber `gorm:"foreignKey:UserID" json:"numbers"`
}
