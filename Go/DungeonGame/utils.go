package main

// Contains checks if a slice contains a particular string item.
func Contains(slice []string, item string) bool {
	for _, a := range slice {
		if a == item {
			return true
		}
	}
	return false
}

// IndexOf returns the index of a particular string item in a slice.
func IndexOf(slice []string, item string) int {
	for i, a := range slice {
		if a == item {
			return i
		}
	}
	return -1
}

// RemoveIndex removes the element at a particular index from a slice.
func RemoveIndex(slice []string, index int) []string {
	return append(slice[:index], slice[index+1:]...)
}
