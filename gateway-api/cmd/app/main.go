package main

import (
	"context"
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
		log.Println(("Error loading .env file"))
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

	// Configura e inicializa o Kafka
	baseKafkaConfig := service.NewKafkaConfig()

	// Configura e inicializa o produtor Kafka
	producerTopic := getEnv("KAFKA_PRODUCER_TOPIC", "pending_transactions")
	producerConfig := baseKafkaConfig.WithTopic(producerTopic)
	kafkaProducer := service.NewKafkaProducer(producerConfig)
	defer kafkaProducer.Close()

	accountRepository := repository.NewAccountRepository(db)
	accountService := service.NewAccountService(accountRepository)

	invoiceRepository := repository.NewInvoiceRepository(db)
	invoiceService := service.NewInvoiceService(invoiceRepository, accountService, kafkaProducer)

	// Configura e inicializa o consumidor Kafka
	consumerTopic := getEnv("KAFKA_CONSUMER_TOPIC", "transactions_result")
	consumerConfig := baseKafkaConfig.WithTopic(consumerTopic)
	groupID := getEnv("KAFKA_CONSUMER_GROUP_ID", "gateway-group")
	kafkaConsumer := service.NewKafkaConsumer(consumerConfig, groupID, invoiceService)
	defer kafkaConsumer.Close()

	// Inicia o consumidor Kafka em uma goroutine
	go func() {
		if err := kafkaConsumer.Consume(context.Background()); err != nil {
			log.Printf("Error consuming kafka messages: %v", err)
		}
	}()

	port := getEnv("HTTP_PORT", "8080")
	server := server.NewServer(accountService, invoiceService, port)
	server.ConfigureRoutes()

	if err := server.Start(); err != nil {
		log.Fatal("Error starting server:", err)
	}
}
