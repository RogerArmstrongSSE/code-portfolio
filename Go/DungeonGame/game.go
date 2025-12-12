package main

import (
	"bufio"
	"fmt"
	"io"
	"strings"
)

type Game struct {
	Rooms    map[string]*Room
	Items    map[string]*Item
	Player   *Player
	Puzzles  []*Puzzle
	Commands map[string]*Command
	GameOver bool
}

func NewGame() *Game {
	// Define the rooms and items
	rooms, err := LoadRoomsFromJSON("rooms.json")
	if err != nil {
		fmt.Println("Unable to load room list!")
		return nil
	}
	items, err := LoadItemsFromJSON("items.json")
	if err != nil {
		fmt.Println("Unable to load item list!")
		return nil
	}

	// Create a new player at entrance
	player := NewPlayer(rooms["Entrance"])

	puzzle := NewPuzzle(rooms["Hallway"])

	commands := InitCommands()

	return &Game{
		Rooms:    rooms,
		Items:    items,
		Player:   player,
		Puzzles:  []*Puzzle{puzzle},
		Commands: commands,
		GameOver: false,
	}
}

func (game *Game) PrintRoomItems() {
	// List items in the room
	if len(game.Player.Location.Items) > 0 {
		for _, item := range game.Player.Location.Items {
			game.Items[item].DescribeItem()
		}
	}
}

func (game *Game) PrintPuzzle(puzzleCheck func(p *Puzzle) bool) {
	// Check if there's a puzzle in the current room
	for _, puzzle := range game.Puzzles {
		if !puzzle.Solved && game.Player.Location == puzzle.Location {
			if !puzzleCheck(puzzle) {
				game.MovePlayerTo(game.Rooms["Entrance"])
				return // Exit the function as soon as we find an unsolved puzzle
			}
		}
	}
}

func (game *Game) MovePlayerTo(nextRoom *Room) {
	if nextRoom.Locked == "true" {
		fmt.Println("The door is locked.")
	} else {
		game.Player.MoveTo(nextRoom)
		game.Player.Location.Describe()
		game.PrintRoomItems()

		if game.Player.Location.Damage > 0 {
			game.Player.HitPoints = game.Player.HitPoints - game.Player.Location.Damage
		}
	}
}

func (game *Game) CheckEndConditions() bool {
	if game.Player.Location.Name == "Entrance" && game.Player.HasItem("treasure") {
		fmt.Println("Congratulations, you have braved The Dungeon of Mysteries and emerged victorious!")
		return true
	}
	if game.Player.HitPoints <= 0 {
		fmt.Println("You have died. Perhaps you can defeat the dungeon in a future life.")
		return true
	}
	return false
}

func (game *Game) HandleInput(reader io.Reader) {
	// Get the player's input
	fmt.Print("Decide your action, adventurer: ")
	bufferedReader := bufio.NewReader(reader)
	input, _ := bufferedReader.ReadString('\n')
	input = strings.TrimSpace(input)
	inputs := strings.Split(strings.ToLower(input), " ")

	nextCommand, ok := game.Commands[inputs[0]]
	if ok {
		switch nextCommand.Action {
		case "look":
			game.Player.Location.Describe()
			game.PrintRoomItems()

		case "inventory":
			fmt.Println("You have:")
			for _, item := range game.Player.Inventory {
				fmt.Println(item)
			}

		case "go":
			direction := ""
			if nextCommand.Argument != "" {
				direction = nextCommand.Argument
			} else if len(inputs) < 2 {
				fmt.Println("Go where?")
				return
			} else {
				direction = inputs[1]
			}

			nextRoom, ok := game.Player.Location.Next[direction]
			if !ok {
				fmt.Println("You cannot go that way.")
				return
			}
			game.MovePlayerTo(game.Rooms[nextRoom])

		case "examine":
			if len(inputs) < 2 {
				fmt.Println("Examine what?")
				return
			}

			item := inputs[1]
			if !game.Player.HasItem(item) {
				fmt.Printf("You do not have the %s.\n", item)
			}

			game.Items[item].ExamineItem()

		case "get":
			if len(inputs) < 2 {
				fmt.Println("Get what?")
				return
			}
			item := inputs[1]
			index := IndexOf(game.Player.Location.Items, item)
			if index == -1 {
				fmt.Printf("There is no %s here.\n", item)
				return
			}
			game.Player.AddItem(item)
			game.Player.Location.RemoveItem(index)

			fmt.Printf("You claim the %s, adding it to your belongings.\n", item)

		case "drop":
			if len(inputs) < 2 {
				fmt.Println("Drop what?")
				return
			}
			item := inputs[1]
			if !game.Player.HasItem(item) {
				fmt.Printf("You do not have the %s.\n", item)
				return
			}
			game.Player.DropItem(item)
			game.Player.Location.AddItem(item)

			fmt.Printf("You drop the %s, leaving it forgotten on the ground.\n", item)

		case "use":
			if len(inputs) < 2 {
				fmt.Println("Use what?")
				return
			}
			item := inputs[1]
			if !game.Player.HasItem(item) {
				fmt.Printf("You do not have the %s.\n", item)
				return
			}

			if Contains(game.Player.Location.CanUse, item) {
				game.Items[item].UseItem()
				RemoveIndex(game.Player.Location.CanUse, IndexOf(game.Player.Location.CanUse, item))
				if len(game.Items[item].Function) > 0 {
					switch game.Items[item].Function[0] {
					case "unlock":
						game.Rooms[game.Items[item].Function[1]].Locked = "false"
					}
				}
				return
			}
			fmt.Println("That item finds no use here.")

		case "help":
			fmt.Printf("%-20s %s\n", "Command", "Action")
			fmt.Printf("%-20s %s\n", "--------------------", "------")
			for _, command := range game.Commands {
				usage := command.Usage
				if usage == "" {
					usage = command.Command
				}
				fmt.Printf("%-20s %s\n", usage, command.Description)
			}

		case "quit":
			game.GameOver = true

		case "restart":
			fmt.Println("Under construction")
		}
	} else {
		fmt.Println("Your command is unrecognizable. Choose your actions wisely.")
	}
}
