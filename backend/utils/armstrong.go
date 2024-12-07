package utils

import "math"

func IsArmstrongNumber(n int) bool {
	temp, sum, digits := n, 0, 0
	for temp > 0 {
		digits++
		temp /= 10
	}

	temp = n
	for temp > 0 {
		digit := temp % 10
		sum += int(math.Pow(float64(digit), float64(digits)))
		temp /= 10
	}

	return sum == n
}
