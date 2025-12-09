package main

import (
	"bufio"
	"fmt"
	"os"
)

func mainMenu(grades []Grade) {
	for {
		fmt.Println("Main Menu")
		fmt.Println("1. View Grades By Student")
		fmt.Println("2. View Grades By Course")
		fmt.Println("3. View GPA List")
		fmt.Println("4. Exit")

		var choice int
		fmt.Print("Enter your choice: ")
		fmt.Scanln(&choice)

		switch choice {
		case 1:
			viewGradesByStudent(grades)
		case 2:
			viewGradesByCourse(grades)
		case 3:
			printGPAList(grades)
		case 4:
			fmt.Println("Exiting program")
			return
		default:
			fmt.Println("Invalid choice")
		}
	}
}

func viewGradesByStudent(grades []Grade) {
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Println("View Grades By Student")
		fmt.Print("Enter student name or blank to return to main menu: ")
		scanner.Scan()
		studentName := scanner.Text()
		if studentName == "" {
			return
		}
		printGradesByStudent(grades, studentName)
	}
}

func viewGradesByCourse(grades []Grade) {
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Println("View Grades By Course")
		fmt.Print("Enter course name or blank to return to main menu: ")
		scanner.Scan()
		courseName := scanner.Text()
		if courseName == "" {
			return
		}
		printGradesByCourse(grades, courseName)
	}
}
