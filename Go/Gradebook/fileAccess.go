package main

import (
	"encoding/csv"
	"io"
	"os"
)

func readGrades(filename string) ([]Grade, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = ','
	reader.LazyQuotes = true

	grades := []Grade{}
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}
		grades = append(grades, Grade{
			Student: record[0],
			Course:  record[1],
			Grade:   record[2],
		})
	}
	return grades, nil
}
