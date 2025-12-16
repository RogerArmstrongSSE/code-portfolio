package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type TicketPurchase struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	EventName string             `bson:"eventName" json:"eventName"`
	Purchaser string             `bson:"purchaser" json:"purchaser"`
	Tickets   int                `bson:"tickets" json:"tickets"`
}

type TicketPurchaseDetails struct {
	EventName string `json:"eventName"`
	Purchaser string `json:"purchaser"`
	Tickets   int    `json:"tickets"`
}
