package repository

import (
	"context"
	"restapi/models"

	"restapi/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type EventRepository struct {
	collection *mongo.Collection
}

func NewEventRepository() *EventRepository {
	return &EventRepository{
		collection: database.Database.Collection("events"),
	}
}

func (r *EventRepository) GetAll(ctx context.Context) ([]models.EventDetails, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var events []models.EventDetails
	for cursor.Next(ctx) {
		var event models.EventDetails
		if err := cursor.Decode(&event); err != nil {
			// Skip corrupted documents and continue
			continue
		}
		events = append(events, event)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return events, nil
}
