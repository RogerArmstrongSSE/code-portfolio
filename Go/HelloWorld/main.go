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
		fmt.Print("Enter your name: ")
		fmt.Scanln(&name)
	}

	if name == "" {
		name = "World"
	}

	fmt.Printf("Hello, %s!\n", name)
}
