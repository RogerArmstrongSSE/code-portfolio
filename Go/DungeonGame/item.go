package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type Item struct {
	Name     string   `json:"name"`
	Location string   `json:"location"`
	Examine  string   `json:"examine"`
	WhenUsed string   `json:"use"`
	Function []string `json:"function"`
}

func (item *Item) DescribeItem() {
	fmt.Println(item.Location)
}

func (item *Item) ExamineItem() {
	fmt.Println(item.Examine)
}

func (item *Item) UseItem() {
	fmt.Println(item.WhenUsed)
}

func LoadItemsFromJSON(filename string) (map[string]*Item, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var items []Item
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&items)
	if err != nil {
		return nil, err
	}

	itemPointers := make(map[string]*Item)
	for i := range items {
		itemPointers[items[i].Name] = &items[i]
	}

	return itemPointers, nil
}
