package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/henricoVilela/gateway-pagamento/gateway-api/internal/repository"
	"github.com/henricoVilela/gateway-pagamento/gateway-api/internal/service"
	"github.com/henricoVilela/gateway-pagamento/gateway-api/internal/web/server"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func getEnv(key string, defautValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defautValue
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		getEnv("DB_HOST", "gateway_db"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "postgres"),
		getEnv("DB_NAME", "gateway"),
		getEnv("DB_SSL_MODE", "disable"),
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	accountRepository := repository.NewAccountRepository(db)
	accountService := service.NewAccountService(accountRepository)

	invoiceRepository := repository.NewInvoiceRepository(db)
	invoiceService := service.NewInvoiceService(invoiceRepository, accountService)

	port := getEnv("HTTP_PORT", "8080")
	server := server.NewServer(accountService, invoiceService, port)
	server.ConfigureRoutes()

	if err := server.Start(); err != nil {
		log.Fatal("Error starting server:", err)
	}
}
