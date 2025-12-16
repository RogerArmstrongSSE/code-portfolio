# REST API with MongoDB

A RESTful API for managing ticket purchases with MongoDB database integration.

## Features

- **CRUD Operations**: Create, Read, Update (upsert), and Delete ticket purchases
- **MongoDB Integration**: Persistent data storage using MongoDB
- **Repository Pattern**: Clean separation of concerns with repository layer
- **Error Handling**: Comprehensive error handling and validation
- **Graceful Shutdown**: Proper server shutdown handling

## Prerequisites

- Go 1.21 or higher
- MongoDB running locally or accessible via connection string

## Setup

1. Install dependencies:
```bash
go mod tidy
```

2. Set environment variables (optional):
```bash
export MONGODB_URI="mongodb://localhost:27017"
export DB_NAME="ticketdb"
```

3. Run the server:
```bash
go run main.go
```

The server will start on `http://localhost:8000`

## API Endpoints

### POST /ticket
Purchase tickets for an event.

**Request Body:**
```json
{
  "eventName": "Concert 2024",
  "purchaser": "name@email.com",
  "tickets": 5
}
```

**Response:**
```json
{
  "message": "Ticket purchase recorded successfully"
}
```

### GET /tickets?eventName={eventName}
Get ticket purchases for a specific event.

**Response:**
```json
[
  {
    "eventName": "Concert 2024",
    "purchaser": "name@email.com",
    "tickets": 10
  }
]
```

### GET /tickets/all
Get all ticket purchases.

**Response:**
```json
[
  {
    "eventName": "Concert 2024",
    "purchaser": "name@email.com",
    "tickets": 10
  }
]
```

### DELETE /ticket/delete?eventName={eventName}&purchaser={email}
Delete ticket purchase for an event.

**Response:**
```json
{
  "message": "Ticket purchase deleted successfully"
}
```

## Project Structure

```
RestApi/
├── main.go              # HTTP server and route handlers
├── database/
│   └── db.go           # MongoDB connection management
├── models/
│   └── ticket.go       # Data models
├── repository/
│   └── ticket_repository.go  # Database operations
└── go.mod              # Go module dependencies
```

## Database Schema

The tickets are stored in MongoDB with the following structure:

```json
{
  "_id": ObjectId,
  "eventName": "string",
  "purchaser": "string",
  "tickets": number
}
```

