package main

import (
	"bufio"
	"fmt"
	"io"
	"math/rand"
	"strconv"
	"strings"
)

type Puzzle struct {
	Location *Room
	Num1     int
	Num2     int
	Solved   bool
}

func NewPuzzle(location *Room) *Puzzle {
	num1 := rand.Intn(10) // generate a random number between 0 and 9
	num2 := rand.Intn(10) // generate a random number between 0 and 9
	return &Puzzle{Location: location, Num1: num1, Num2: num2, Solved: false}
}

func (puzzle *Puzzle) Check(input io.Reader, output io.Writer) bool {
	if puzzle.Solved {
		return true
	}

	question := fmt.Sprintf("A spectral figure emerges before you, demanding an answer, 'Solve this riddle mortal, what is %d + %d?'", puzzle.Num1, puzzle.Num2)
	fmt.Fprintln(output, question)
	reader := bufio.NewReader(input)
	response, _ := reader.ReadString('\n')
	_ = strings.Contains(response, "")
	response = strings.TrimSpace(response)

	answer, err := strconv.Atoi(response)
	if err != nil || answer != puzzle.Num1+puzzle.Num2 {
		fmt.Fprintln(output, "Your answer does not please the spirit. You are whisked away back to the start.")
		return false
	}

	fmt.Fprintln(output, "Your answer appeases the spirit, a key materializes before you. Command 'Get key' to claim your reward.")
	puzzle.Solved = true
	return true
}
