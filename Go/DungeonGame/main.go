package main

import (
	"fmt"
	"os"
)

func main() {
	game := NewGame()

	// Run the game loop
	if game != nil {
		game.MovePlayerTo(game.Rooms["Entrance"])
		for {
			game.PrintPuzzle(func(p *Puzzle) bool { return p.Check(os.Stdin, os.Stdout) })
			game.HandleInput(os.Stdin)
			game.GameOver = game.CheckEndConditions()
			if game.GameOver {
				break
			}
		}
		fmt.Println("Thank you for playing The Dungeon of Mysteries. Farewell and may we meet again in another adventure.")
	}
}
