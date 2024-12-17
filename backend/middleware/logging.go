package middleware

import (
	"log"
	"net/http"
	"time"
)

// LoggerMiddleware logs details of incoming API calls.
func LoggerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		startTime := time.Now()

		// Log the incoming request
		log.Printf("Started %s %s", r.Method, r.URL.Path)

		// Wrap the response writer to capture status code
		lrw := &loggingResponseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		// Call the next handler
		next.ServeHTTP(lrw, r)

		// Log the response details
		duration := time.Since(startTime)
		log.Printf("Completed %s %s with status %d in %v",
			r.Method, r.URL.Path, lrw.statusCode, duration)
	})
}

// loggingResponseWriter is a wrapper to capture the response status code
type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}
