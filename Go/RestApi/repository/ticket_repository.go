package repository

import (
	"context"
	"restapi/models"

	"restapi/database"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type TicketRepository struct {
	collection *mongo.Collection
}

func NewTicketRepository() *TicketRepository {
	return &TicketRepository{
		collection: database.Database.Collection("tickets"),
	}
}

// CreateOrUpdate creates a new ticket purchase or updates existing one
func (r *TicketRepository) CreateOrUpdate(ctx context.Context, eventName string, purchaser string, tickets int) error {
	filter := bson.M{
		"eventName": eventName,
		"purchaser": purchaser,
	}
	update := bson.M{
		"$inc":         bson.M{"tickets": tickets},
		"$setOnInsert": bson.M{"eventName": eventName, "purchaser": purchaser},
	}

	opts := options.UpdateOne().SetUpsert(true)
	_, err := r.collection.UpdateOne(ctx, filter, update, opts)
	return err
}

// GetByEventName retrieves ticket purchases for an event
func (r *TicketRepository) GetByEventName(ctx context.Context, eventName string) ([]models.TicketPurchaseDetails, error) {
	filter := bson.M{"eventName": eventName}
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tickets []models.TicketPurchaseDetails
	for cursor.Next(ctx) {
		var ticket models.TicketPurchaseDetails
		if err := cursor.Decode(&ticket); err != nil {
			// Skip corrupted documents and continue
			continue
		}
		tickets = append(tickets, ticket)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return tickets, nil
}

// GetAll retrieves all ticket purchases
func (r *TicketRepository) GetAll(ctx context.Context) ([]models.TicketPurchaseDetails, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tickets []models.TicketPurchaseDetails
	for cursor.Next(ctx) {
		var ticket models.TicketPurchaseDetails
		if err := cursor.Decode(&ticket); err != nil {
			// Skip corrupted documents and continue
			continue
		}
		tickets = append(tickets, ticket)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return tickets, nil
}

// Delete removes a ticket purchase record
func (r *TicketRepository) Delete(ctx context.Context, eventName string, purchaser string) error {
	filter := bson.M{"eventName": eventName, "purchaser": purchaser}
	_, err := r.collection.DeleteOne(ctx, filter)
	return err
}

// GetTotalTickets retrieves the total number of tickets for an event
func (r *TicketRepository) GetTotalTickets(ctx context.Context, eventName string) int {
	filter := bson.M{"eventName": eventName}
	cursor, err := r.collection.Aggregate(ctx, mongo.Pipeline{
		{{Key: "$match", Value: filter}},
		{{Key: "$group", Value: bson.M{"_id": "$eventName", "totalTickets": bson.M{"$sum": "$tickets"}}}},
	})
	if err != nil {
		return 0
	}
	defer cursor.Close(ctx)

	var result struct {
		TotalTickets int `bson:"totalTickets"`
	}
	if err := cursor.Decode(&result); err != nil {
		return 0
	}
	return result.TotalTickets
}
