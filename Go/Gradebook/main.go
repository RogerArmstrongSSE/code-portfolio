package main

import (
	"fmt"
	"os"
)

func main() {
	var name string

	if len(os.Args) > 1 {
		name = os.Args[1]
	} else {
		fmt.Print("Enter filename in csv format: ")
		fmt.Scanln(&name)
	}

	if name == "" {
		name = "grades.csv"
	}

	fmt.Printf("Reading grades from %s\n", name)
	grades, err := readGrades(name)
	if err != nil {
		fmt.Printf("Error reading grades: %v\n", err)
		return
	}

	mainMenu(grades)
}
