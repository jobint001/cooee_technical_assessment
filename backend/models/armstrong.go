package models

import "time"

type ArmstrongNumber struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	UserID    uint      `json:"user_id" gorm:"index"`
	Number    int       `json:"number"`
	CreatedAt time.Time `json:"created_at"`
}
