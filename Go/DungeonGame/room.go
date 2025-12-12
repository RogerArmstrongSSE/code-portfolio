package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type Room struct {
	Name     string            `json:"name"`
	Contents string            `json:"contents"`
	Next     map[string]string `json:"next"`
	Items    []string          `json:"items"`
	CanUse   []string          `json:"canUse"`
	Locked   string            `json:"locked"`
	Damage   int               `json:"damage"`
}

func NewRoom(name string, contents string, items []string, canUse []string) *Room {
	return &Room{Name: name, Contents: contents, Next: make(map[string]string), Items: items, CanUse: canUse}
}

func (room *Room) AddNext(direction string, nextRoom string) {
	room.Next[direction] = nextRoom
}

func (room *Room) RemoveItem(itemIndex int) {
	room.Items = RemoveIndex(room.Items, itemIndex)
}

func (room *Room) AddItem(item string) {
	room.Items = append(room.Items, item)
}

func (room *Room) Describe() {
	fmt.Println(room.Contents)
}

// LoadRoomsFromJSON reads rooms from a JSON file and returns a slice of Room pointers
func LoadRoomsFromJSON(filename string) (map[string]*Room, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var rooms []Room
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&rooms)
	if err != nil {
		return nil, err
	}

	// Convert []Room to []*Room and ensure Next maps are initialized
	roomPointers := make(map[string]*Room)
	for i := range rooms {
		if rooms[i].Next == nil {
			rooms[i].Next = make(map[string]string)
		}
		roomPointers[rooms[i].Name] = &rooms[i]
	}

	return roomPointers, nil
}
