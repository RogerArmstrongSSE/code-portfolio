package main

type Player struct {
	Location  *Room
	Inventory []string
	HitPoints int
}

func NewPlayer(location *Room) *Player {
	return &Player{location, []string{}, 10}
}

func (player *Player) MoveTo(nextRoom *Room) {
	player.Location = nextRoom
}

func (player *Player) AddItem(item string) {
	player.Inventory = append(player.Inventory, item)
}

func (player *Player) DropItem(item string) {
	player.Inventory = RemoveIndex(player.Inventory, IndexOf(player.Inventory, item))
}

func (player *Player) RemoveItemFromRoom(itemIndex int) {
	player.Location.Items = RemoveIndex(player.Location.Items, itemIndex)
}

func (player *Player) HasItem(item string) bool {
	return Contains(player.Inventory, item)
}
