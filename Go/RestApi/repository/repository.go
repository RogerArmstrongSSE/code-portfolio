package repository

import (
	"context"
	"restapi/models"
)

type Repository struct {
	EventRepository  *EventRepository
	TicketRepository *TicketRepository
}

func NewRepository() *Repository {
	return &Repository{
		EventRepository:  NewEventRepository(),
		TicketRepository: NewTicketRepository(),
	}
}

func (r *Repository) GetAllEvents(ctx context.Context) ([]models.EventDetails, error) {
	events, err := r.EventRepository.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	for i, event := range events {
		event.AvailableTickets = event.TotalTickets - r.TicketRepository.GetTotalTickets(ctx, event.EventName)
		events[i] = event
	}
	return events, nil
}
