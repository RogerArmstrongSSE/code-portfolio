package main

type Command struct {
	Command     string
	Action      string
	Argument    string
	Usage       string
	Description string
}

func NewCommand(command string, action string, argument string, usage string, description string) *Command {
	return &Command{Command: command, Action: action, Argument: argument, Usage: usage, Description: description}
}

func InitCommands() map[string]*Command {
	commands := make(map[string]*Command)

	//descriptive commands
	commands["l"] = NewCommand("l", "look", "", "", "Look around the current room")
	commands["look"] = NewCommand("look", "look", "", "", "Look around the current room")
	commands["i"] = NewCommand("i", "inventory", "", "", "List what you are carrying")
	commands["inventory"] = NewCommand("inventory", "inventory", "", "", "List what you are carrying")

	//motion commands
	commands["go"] = NewCommand("go", "go", "", "go <direction>", "Move in the specified direction")
	commands["e"] = NewCommand("e", "go", "east", "", "Move to the east")
	commands["east"] = NewCommand("east", "go", "east", "", "Move to the east")
	commands["w"] = NewCommand("w", "go", "west", "", "Move to the west")
	commands["west"] = NewCommand("west", "go", "west", "", "Move to the west")
	commands["n"] = NewCommand("n", "go", "north", "", "Move to the north")
	commands["north"] = NewCommand("north", "go", "north", "", "Move to the north")
	commands["s"] = NewCommand("s", "go", "south", "", "Move to the south")
	commands["south"] = NewCommand("south", "go", "south", "", "Move to the south")

	//item interaction commands
	commands["examine"] = NewCommand("examine", "examine", "", "examine <object>", "Get details about the specified object")
	commands["get"] = NewCommand("get", "get", "", "get <object>", "Pick up the specified object and add it to your inventory")
	commands["take"] = NewCommand("take", "get", "", "take <object>", "Pick up the specified object and add it to your inventory")
	commands["drop"] = NewCommand("drop", "drop", "", "drop <object>", "Remove the specified object from your inventory")
	commands["use"] = NewCommand("use", "use", "", "use <object>", "Use the specified object if possible")

	//meta commands
	commands["help"] = NewCommand("help", "help", "", "", "Print this help screen")
	commands["q"] = NewCommand("q", "quit", "", "", "Exit the game")
	commands["quit"] = NewCommand("quit", "quit", "", "", "Exit the game")
	commands["restart"] = NewCommand("restart", "restart", "", "", "Start the game over from the beginning")

	return commands
}
