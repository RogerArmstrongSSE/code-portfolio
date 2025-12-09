package main

import (
	"fmt"
	"sort"
)

func printGradesByStudent(grades []Grade, studentName string) {
	studentGrades := []Grade{}
	for _, grade := range grades {
		if grade.Student == studentName {
			studentGrades = append(studentGrades, grade)
		}
	}
	if len(studentGrades) == 0 {
		fmt.Printf("No grades found for %s\n", studentName)
		return
	}

	// Sort by course name
	sort.Slice(studentGrades, func(i, j int) bool {
		return studentGrades[i].Course < studentGrades[j].Course
	})

	fmt.Printf("Grades for %s\n", studentName)
	fmt.Printf("%-20s %-10s\n", "Course", "Grade")
	fmt.Printf("%-20s %-10s\n", "--------------------", "-----")
	for _, grade := range studentGrades {
		fmt.Printf("%-20s %-10s\n", grade.Course, grade.Grade)
	}
}

func printGradesByCourse(grades []Grade, courseName string) {
	courseGrades := []Grade{}
	for _, grade := range grades {
		if grade.Course == courseName {
			courseGrades = append(courseGrades, grade)
		}
	}
	if len(courseGrades) == 0 {
		fmt.Printf("No grades found for %s\n", courseName)
		return
	}

	// Sort by student name
	sort.Slice(courseGrades, func(i, j int) bool {
		return courseGrades[i].Student < courseGrades[j].Student
	})

	fmt.Printf("Grades for %s\n", courseName)
	fmt.Printf("%-20s %-10s\n", "Student", "Grade")
	fmt.Printf("%-20s %-10s\n", "--------------------", "-----")
	for _, grade := range courseGrades {
		fmt.Printf("%-20s %-10s\n", grade.Student, grade.Grade)
	}
}

func printGPAList(grades []Grade) {
	studentGrades := make(map[string][]string)
	for _, grade := range grades {
		studentGrades[grade.Student] = append(studentGrades[grade.Student], grade.Grade)
	}

	studentNames := make([]string, 0, len(studentGrades))
	for student := range studentGrades {
		studentNames = append(studentNames, student)
	}

	sort.Slice(studentNames, func(i, j int) bool {
		return studentNames[i] < studentNames[j]
	})

	fmt.Printf("Grade Points Average List\n")
	fmt.Printf("%-20s %-10s\n", "Student", "GPA")
	fmt.Printf("%-20s %-10s\n", "--------------------", "-----")
	for _, student := range studentNames {
		fmt.Printf("%-20s %-10.1f\n", student, calculateGPA(studentGrades[student]))
	}
}

func calculateGPA(grades []string) float64 {
	total := 0.0
	for _, grade := range grades {
		total += getGradePoints(grade)
	}
	return total / float64(len(grades))
}

func getGradePoints(grade string) float64 {
	switch grade {
	case "A":
		return 4.0
	case "B":
		return 3.0
	case "C":
		return 2.0
	case "D":
		return 1.0
	case "F":
		return 0.0
	}
	return 0.0
}
