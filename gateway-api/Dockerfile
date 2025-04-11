# Use the official Golang image as a build stage
FROM golang:1.24 AS builder

# Set the working directory
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the application
RUN go build -o gateway-api .

# Use a minimal image for the final stage
FROM alpine:latest

# Set the working directory
WORKDIR /root/

# Copy the built binary from the builder stage
COPY --from=builder /app/gateway-api .

# Expose the application port
EXPOSE 8081

# Start the application
CMD ["./gateway-api"]
