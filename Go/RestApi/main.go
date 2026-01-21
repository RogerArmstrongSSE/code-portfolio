package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"

	"restapi/database"
	"restapi/models"
	"restapi/repository"
)

var repo *repository.Repository
var ticketRepo *repository.TicketRepository

func init() {
	// loads values from .env into the system environment
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on OS environment variables")
	}
}

func main() {
	// Initialize database connection
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb+srv://username:password@server.mongodb.net/?appName=cluster"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "ticketdb"
	}

	err := database.Connect(mongoURI, dbName)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Disconnect()

	log.Println("Connected to MongoDB successfully")

	// Initialize repository
	repo = repository.NewRepository()
	ticketRepo = repo.TicketRepository

	// Setup routes
	http.HandleFunc("/ticket", handleTicketPurchase)
	http.HandleFunc("/tickets", handleGetTickets)
	http.HandleFunc("/tickets/all", handleGetAllTickets)
	http.HandleFunc("/ticket/delete", handleDeleteTicket)
	http.HandleFunc("/events/all", handleGetAllEvents)

	// Setup graceful shutdown
	server := &http.Server{
		Addr:    ":8000",
		Handler: nil,
	}

	// Start server in a goroutine
	go func() {
		log.Println("Server starting on :8000")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited")
}

func handleTicketPurchase(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	var data models.TicketPurchaseDetails
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if data.EventName == "" {
		http.Error(w, "Event name is required", http.StatusBadRequest)
		return
	}

	if data.Purchaser == "" {
		http.Error(w, "Purchaser email is required", http.StatusBadRequest)
		return
	}

	if data.Tickets <= 0 {
		http.Error(w, "Ticket count must be greater than 0", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = ticketRepo.CreateOrUpdate(ctx, data.EventName, data.Purchaser, data.Tickets)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to save ticket purchase: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Ticket purchase recorded successfully"})
}

func handleGetTickets(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	eventName := r.URL.Query().Get("eventName")
	if eventName == "" {
		http.Error(w, "Missing event name", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tickets, err := ticketRepo.GetByEventName(ctx, eventName)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to retrieve tickets: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tickets)
}

func handleGetAllTickets(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tickets, err := ticketRepo.GetAll(ctx)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to retrieve tickets: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tickets)
}

func handleDeleteTicket(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	eventName := r.URL.Query().Get("eventName")
	if eventName == "" {
		http.Error(w, "Missing event name", http.StatusBadRequest)
		return
	}

	purchaser := r.URL.Query().Get("purchaser")
	if purchaser == "" {
		http.Error(w, "Missing purchaser email", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := ticketRepo.Delete(ctx, eventName, purchaser)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to delete ticket: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Ticket purchase deleted successfully"})
}

func handleGetAllEvents(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	events, err := repo.GetAllEvents(ctx)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to retrieve events: %v", err), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}
